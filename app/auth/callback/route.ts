import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
      if (u) {
        const m = (u.user_metadata || {}) as Record<string, string>;
        await supabase.from("cs_participants").upsert(
          {
            user_id: u.id,
            first_name: m.first_name || null,
            last_name: m.last_name || null,
            email: u.email || m.email || null,
            phone: m.phone || null,
            city: m.city || null,
            state: m.state || null,
            zip: m.zip || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
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
