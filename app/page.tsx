import type { ReactNode } from "react";
import { Compass, Butterfly } from "./components/icons";
import { ContinueButton } from "./components/ContinueButton";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mt-16 mb-2.5 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{children}</p>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-indigo/10 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-[22px] py-3.5">
        <div className="flex items-center gap-2.5">
          <Compass className="h-8 w-8 text-gold" />
          <div>
            <div className="font-serif text-[19px] font-semibold tracking-wide leading-none">LifeCharter</div>
            <div className="mt-0.5 text-[9px] uppercase tracking-[0.32em] text-indigo/55">Command Suite</div>
          </div>
        </div>
        <span className="hidden text-xs text-indigo/55 sm:block">Head Up — Wings Out 🦋</span>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="mx-auto max-w-[1180px] px-[22px] pb-16">
        {/* hero */}
        <section className="bg-watercolor-deep relative mt-8 overflow-hidden rounded-[26px] px-6 py-14 text-center text-ivory shadow-soft sm:px-10">
          <Butterfly className="pointer-events-none absolute -right-5 top-6 h-48 w-56 animate-floaty text-gold/15" />
          <Compass className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 text-lavender/10" />
          <div className="relative animate-fadeUp">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              The Command Shift · 21-Day Challenge
            </p>
            <h1 className="mx-auto max-w-3xl font-serif text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] text-balance">
              Welcome to The Command Shift.
            </h1>
            <p className="mx-auto mt-4 max-w-[620px] text-[18px] leading-relaxed text-ivory/80">
              Over the next 21 days, you&apos;ll move from a scattered hustle to hard-won harmony — one clear command
              center where your mission, brand, and business finally align, on purpose.
            </p>
            <ContinueButton />
          </div>
        </section>

        {/* what to expect */}
        <Eyebrow>What to expect</Eyebrow>
        <h2 className="text-center font-serif text-[clamp(24px,3.2vw,34px)] font-semibold text-balance">
          Three weeks. One deliberate arc.
        </h2>
        <p className="mx-auto mt-2 mb-6 max-w-[640px] text-center text-[17px] leading-relaxed text-indigo/75">
          Each week builds on the last — first Truth, then structure, then command.
        </p>
        <div className="grid gap-[18px] md:grid-cols-3">
          {[
            ["Week 1", "Truth & Clarity", "Get honest about where your business stands and why it exists. Audit, declutter, and name your True North."],
            ["Week 2", "Build the Engine", "Turn clarity into structure — your offer, revenue path, first systems, brand voice, position, and daily rhythm."],
            ["Week 3", "Live in Command", "Bring it all into one command center, lead from the seat, and make the whole shift permanent."],
          ].map(([wk, h, p]) => (
            <div key={h} className="rounded-[20px] border border-indigo/10 bg-white/70 p-[26px] shadow-card">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">{wk}</div>
              <h3 className="mt-3 font-serif text-[19px] font-semibold text-indigo">{h}</h3>
              <p className="mt-2 leading-relaxed text-indigo/75">{p}</p>
            </div>
          ))}
        </div>

        {/* how each day works */}
        <Eyebrow>How each day works</Eyebrow>
        <h2 className="text-center font-serif text-[clamp(24px,3.2vw,34px)] font-semibold text-balance">
          About fifteen minutes. One clear move.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1", "Listen", "A short daily audio from your Alignment Architect."],
            ["2", "Reflect", "One honest prompt that turns the teaching into clarity."],
            ["3", "Act", "A single aligned action you can finish today."],
            ["4", "Anchor", "Carry a morning intention and evening reflection into your day."],
          ].map(([num, h, p]) => (
            <div key={h} className="rounded-[20px] border border-indigo/10 bg-white/70 p-[26px] shadow-card">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-indigo text-sm font-bold text-ivory">{num}</div>
              <h3 className="mt-3 font-serif text-[19px] font-semibold text-indigo">{h}</h3>
              <p className="mt-2 leading-relaxed text-indigo/75">{p}</p>
            </div>
          ))}
        </div>

        {/* how to get the most */}
        <Eyebrow>How to get the most out of it</Eyebrow>
        <div className="mx-auto max-w-[760px] rounded-[22px] border border-indigo/10 bg-white/70 p-2 shadow-card">
          {[
            ["01", "Same time each day.", "Anchor the challenge to an existing habit — coffee, the school run, the first quiet moment. Rhythm is what makes it stick."],
            ["02", "Do the one action.", "Reading isn't the shift — doing is. Each day asks for one small, finishable move. Actually make it."],
            ["03", "One day at a time.", "Don't binge to “catch up.” The days are meant to unlock one at a time — that's how the change compounds."],
            ["04", "Journal honestly.", "Your reflections are only for you. The more honest they are, the more the clarity is real."],
            ["05", "Use the anchors.", "Say the morning intention when you start; answer the evening reflection when you close. They seat the shift as identity."],
          ].map(([k, h, p], i) => (
            <div key={k} className={`flex gap-3.5 px-5 py-4 ${i > 0 ? "border-t border-indigo/10" : ""}`}>
              <span className="font-serif font-bold text-gold">{k}</span>
              <div>
                <strong className="text-indigo">{h}</strong>
                <p className="mt-0.5 leading-relaxed text-indigo/80">{p}</p>
              </div>
            </div>
          ))}
        </div>

        {/* walk away with */}
        <Eyebrow>What you&apos;ll walk away with</Eyebrow>
        <ul className="mx-auto grid max-w-[760px] list-none grid-cols-1 gap-x-[26px] gap-y-2.5 sm:grid-cols-2">
          {[
            "A clear, honest mission line",
            "A named True North for this season",
            "An honest Command Audit of your business",
            "A sharpened offer and mapped revenue engine",
            "Your first systems and reclaimed brand voice",
            "One command center to lead from — daily",
          ].map((t) => (
            <li key={t} className="flex gap-2.5 py-2 text-indigo/80">
              <span className="text-gold">✦</span>
              {t}
            </li>
          ))}
        </ul>

        {/* architect */}
        <Eyebrow>Meet your Alignment Architect</Eyebrow>
        <div className="mx-auto max-w-[620px] text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-gold/50 bg-white/60">
            <Butterfly className="h-11 w-14 text-gold" />
          </div>
          <p className="text-[16px] leading-relaxed text-indigo/75">
            {/* Replace with Babs's real bio + headshot */}
            I&apos;m Babs, and I&apos;m an Alignment Architect. I help founders and coaches stop white-knuckling the
            hustle and start running their businesses from one clear command center — on purpose, from Truth, built to
            last. I&apos;d love to walk these 21 days with you.
          </p>
          <p className="mt-3.5 font-serif text-[18px] text-plum">Head Up — Wings Out. 🦋</p>
        </div>

        <div className="mt-16 text-center">
          <ContinueButton />
        </div>
      </div>
    </main>
  );
}
