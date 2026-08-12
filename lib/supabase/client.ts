"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for The Command Shift.
 * Points at the shared LifeCharter Command Suite project so a challenge
 * account IS the Command Suite account. Uses the public anon key + RLS.
 */
let cached: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (cached) return cached;
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return cached;
}

/** Convenience: returns the signed-in user's id, or null when anonymous. */
export async function getUserId(): Promise<string | null> {
  try {
    const { data } = await createClient().auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}
