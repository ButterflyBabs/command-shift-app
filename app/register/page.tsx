import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Butterfly } from "../components/icons";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register — The Command Shift 21-Day Challenge",
  description:
    "Join the free Command Shift 21-day challenge. Trade the scramble for one clear command center — one small aligned move a day, by email and text.",
};

export default function RegisterPage() {
  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-indigo/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-[22px] py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <Compass className="h-8 w-8 text-gold" />
            <div>
              <div className="font-serif text-[19px] font-semibold leading-none tracking-wide">LifeCharter</div>
              <div className="mt-0.5 text-[9px] uppercase tracking-[0.32em] text-indigo/55">Command Suite</div>
            </div>
          </Link>
          <span className="hidden text-xs text-indigo/55 sm:block">Head Up — Wings Out 🦋</span>
        </div>
      </header>

      <section className="bg-watercolor-soft">
        <div className="mx-auto max-w-[1180px] px-[22px] py-14">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Butterfly className="h-10 w-12 text-gold" />
            </div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
              The Command Shift · Free 21-Day Challenge
            </p>
            <h1 className="font-serif text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.1] text-balance">
              Reserve your spot — free.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-indigo/75">
              Twenty-one days from a scattered hustle to hard-won harmony. One small aligned move a day, delivered by
              email and text, with a daily audio from your Alignment Architect.
            </p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
