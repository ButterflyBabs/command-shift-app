import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertParticipant } from "@/lib/participant";

/**
 * Magic-link callback. Exchanges the code for a session, upserts the
 * participant's profile row (challenge.cs_participants) from their auth
 * metadata, then redirects into the challenge.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/day/1";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (u) await upsertParticipant(supabase, u, request);
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }
  // The link didn't verify. That is almost always a link being opened a second
  // time — magic links are single-use by design. If this browser still has a
  // valid session, the reuse is harmless: send them where they were going
  // instead of bouncing them to a sign-in page they don't need.
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) return NextResponse.redirect(new URL(next, url.origin));
  } catch {
    /* fall through to the sign-in page */
  }
  return NextResponse.redirect(
    new URL(`/login?reason=used&next=${encodeURIComponent(next)}`, url.origin)
  );
}
