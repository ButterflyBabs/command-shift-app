import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Butterfly } from "../components/icons";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — The Command Shift",
  description: "Sign in to save your Command Shift progress and journals across devices.",
};

export default function LoginPage() {
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
          <Link href="/register" className="text-xs font-semibold text-teal hover:text-plum">
            New here? Register →
          </Link>
        </div>
      </header>

      <section className="bg-watercolor-soft">
        <div className="mx-auto max-w-[1180px] px-[22px] py-16">
          <div className="mx-auto mb-8 max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              <Butterfly className="h-9 w-11 text-gold" />
            </div>
            <h1 className="font-serif text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] text-balance">
              Welcome back.
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-[16px] leading-relaxed text-indigo/75">
              Sign in to pick up your Command Shift — your progress and journals, saved across devices.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
