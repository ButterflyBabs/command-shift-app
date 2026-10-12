import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Today's calendar date (YYYY-MM-DD) in the visitor's own time zone.
 * Vercel sends the visitor's IANA zone in `x-vercel-ip-timezone`; if it is
 * missing or unusable we return null and the database default (UTC) applies.
 */
export function localDateFromRequest(request: Request): string | null {
  const tz = request.headers.get("x-vercel-ip-timezone");
  if (!tz) return null;
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return null;
  }
}

/**
 * Upserts the participant row from their auth metadata. A brand-new row gets a
 * start_date in the participant's own time zone (so Day 1 is their first local
 * day, not the UTC day); an existing row keeps the start date it already has.
 */
export async function upsertParticipant(supabase: SupabaseClient, u: User, request: Request) {
  const m = (u.user_metadata || {}) as Record<string, string>;
  const { data: existing } = await supabase
    .from("cs_participants")
    .select("user_id")
    .eq("user_id", u.id)
    .maybeSingle();
  const localDate = existing ? null : localDateFromRequest(request);
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
      ...(localDate ? { start_date: localDate } : {}),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}
