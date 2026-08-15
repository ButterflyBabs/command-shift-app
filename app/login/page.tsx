import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Emblem } from "../components/icons";
import { LoginForm } from "./LoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in — The Command Shift",
  description: "Sign in to save your Command Shift progress and journals across devices.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { reason?: string; next?: string; error?: string };
}) {
  const next = searchParams?.next || "/day/1";
  // Already signed in? Don't make them sign in again — that's the whole
  // complaint behind "the link only works once."
  try {
    const { data } = await createClient().auth.getUser();
    if (data.user) redirect(next);
  } catch {
    /* not signed in — show the form */
  }

  // ?error=1 is the legacy value; ?reason=used is what the auth routes send now.
  const linkWasUsed = searchParams?.reason === "used" || searchParams?.error === "1";

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-indigo/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-[22px] py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <Emblem className="h-9 w-9" />
            <div>
              <div className="font-serif text-[19px] font-semibold leading-none tracking-wide">LifeCharter</div>
              <div className="mt-0.5 text-[9px] uppercase tracking-[0.32em] text-indigo/55">Command Suite</div>
            </div>
          </Link>
          <Link href="/register" className="text-xs font-semibold text-teal hover:text-plum">
            New here? Register →
          </Link>
        </div>
      </header>

      <section className="bg-watercolor-soft">
        <div className="mx-auto max-w-[1180px] px-[22px] py-16">
          <div className="mx-auto mb-8 max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Emblem className="h-14 w-14" />
            </div>
            <h1 className="font-serif text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] text-balance">
              Welcome back.
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-[16px] leading-relaxed text-indigo/75">
              Sign in to pick up your Command Shift — your progress and journals, saved across devices.
            </p>
            {linkWasUsed && (
              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-gold/45 bg-gold/[0.07] px-5 py-4 text-left">
                <p className="text-[13px] font-semibold text-indigo">That link has already been used.</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-indigo/75">
                  Sign-in links work once, to keep your journal private. Pop your email in below and
                  we&apos;ll send a fresh one — you&apos;ll land right back where you left off.
                </p>
              </div>
            )}
          </div>
          <LoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
