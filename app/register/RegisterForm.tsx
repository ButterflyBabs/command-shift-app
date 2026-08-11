"use client";

import { useState } from "react";
import Link from "next/link";
import { Butterfly } from "../components/icons";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

type Fields = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
};

const EMPTY: Fields = { firstName: "", lastName: "", city: "", state: "", zip: "", phone: "", email: "" };

export function RegisterForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const missing = (Object.keys(f) as (keyof Fields)[]).filter((k) => !f[k].trim());
    if (missing.length) {
      setError("Please complete every field so we can send your daily lessons.");
      return;
    }
    if (!f.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("busy");
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      setStatus("done"); // capture is best-effort; always confirm
    } catch {
      setStatus("done");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-md rounded-[26px] border border-indigo/10 bg-white/80 p-10 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-white/70">
          <Butterfly className="h-10 w-12 text-gold" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-indigo">You&apos;re in{f.firstName ? `, ${f.firstName}` : ""}. 🦋</h2>
        <p className="mt-3 leading-relaxed text-indigo/75">
          Welcome to The Command Shift. Day 1 is on its way to your inbox and phone — and you can begin right now.
          Check your email (and spam, just in case) for your daily lessons.
        </p>
        <Link
          href="/day/1"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-[15px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft"
        >
          Begin Day 1 →
        </Link>
        <p className="mt-5 font-serif text-plum">Head Up — Wings Out.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 text-[15px] text-indigo outline-none transition placeholder-indigo/40 focus:ring-2 focus:ring-gold/60";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-[26px] border border-indigo/10 bg-white/80 p-8 shadow-card sm:p-10" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">First name</label>
          <input id="firstName" className={inputCls} value={f.firstName} onChange={set("firstName")} autoComplete="given-name" placeholder="First name" required />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">Last name</label>
          <input id="lastName" className={inputCls} value={f.lastName} onChange={set("lastName")} autoComplete="family-name" placeholder="Last name" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">Email address</label>
          <input id="email" type="email" className={inputCls} value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">Mobile number <span className="font-normal text-indigo/50">(for your daily text nudge)</span></label>
          <input id="phone" type="tel" className={inputCls} value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="(555) 555-5555" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="city" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">City</label>
          <input id="city" className={inputCls} value={f.city} onChange={set("city")} autoComplete="address-level2" placeholder="City" required />
        </div>
        <div>
          <label htmlFor="state" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">State</label>
          <select id="state" className={inputCls} value={f.state} onChange={set("state")} autoComplete="address-level1" required>
            <option value="" disabled>Select…</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="zip" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">Zip code</label>
          <input id="zip" className={inputCls} value={f.zip} onChange={set("zip")} autoComplete="postal-code" inputMode="numeric" placeholder="ZIP" required />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-plum">{error}</p>}

      <button
        type="submit"
        disabled={status === "busy"}
        className="mt-6 w-full rounded-full bg-gold px-8 py-4 text-[15px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft disabled:opacity-70"
      >
        {status === "busy" ? "Reserving your spot…" : "Start the free challenge →"}
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-indigo/55">
        Free forever · Day 1 arrives in minutes by email and text · Unsubscribe anytime · Reply STOP to opt out of texts.
      </p>
    </form>
  );
}
