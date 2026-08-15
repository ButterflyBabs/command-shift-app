import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Device-independent magic-link verification.
 *
 * Uses `token_hash` + `verifyOtp` so the sign-in link works even when it's
 * opened on a DIFFERENT device or browser than the one that requested it
 * (phone vs. laptop, or an email app's in-app browser). The older PKCE
 * `?code=` exchange in /auth/callback only works in the same browser that
 * requested the link, which is why new users were being bounced to /login.
 *
 * Email templates should point their button here:
 *   https://command-shift-app.vercel.app/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink&next=/day/1
 * (type=signup for the "Confirm signup" template.)
 */

type OtpType = "email" | "magiclink" | "signup" | "recovery" | "invite" | "email_change";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") || "email") as OtpType;
  const next = url.searchParams.get("next") || "/day/1";

  if (token_hash) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
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
