"use client";

import { useState } from "react";
import { Emblem } from "../components/icons";
import { createClient } from "@/lib/supabase/client";

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

/** Best-effort "open your inbox" link based on the email's provider. */
function inboxLink(email: string): { label: string; href: string } | null {
  const d = (email.split("@")[1] || "").toLowerCase();
  if (d.includes("gmail") || d.includes("googlemail"))
    return { label: "Open Gmail", href: "https://mail.google.com/mail/u/0/#search/from%3A(lccssupport%40amilynnecarroll.com)" };
  if (d.includes("outlook") || d.includes("hotmail") || d.includes("live") || d.includes("msn"))
    return { label: "Open Outlook", href: "https://outlook.live.com/mail/0/" };
  if (d.includes("yahoo")) return { label: "Open Yahoo Mail", href: "https://mail.yahoo.com/" };
  if (d.includes("icloud") || d.includes("me.com") || d.includes("mac.com"))
    return { label: "Open iCloud Mail", href: "https://www.icloud.com/mail/" };
  if (d.includes("aol")) return { label: "Open AOL Mail", href: "https://mail.aol.com/" };
  return null;
}

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
      // 1) Marketing/CRM: fire the Global Control tag + write contact fields (best-effort).
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      // 2) Account: create the shared Supabase identity + email a magic link.
      //    Their details ride along as user_metadata; progress saves once they sign in.
      try {
        const redirectTo =
          typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/day/1` : undefined;
        await createClient().auth.signInWithOtp({
          email: f.email,
          options: {
            emailRedirectTo: redirectTo,
            shouldCreateUser: true,
            data: {
              first_name: f.firstName,
              last_name: f.lastName,
              phone: f.phone,
              city: f.city,
              state: f.state,
              zip: f.zip,
            },
          },
        });
      } catch {
        /* account creation is best-effort; they can still start now */
      }
      setStatus("done");
    } catch {
      setStatus("done");
    }
  }

  if (status === "done") {
    const inbox = inboxLink(f.email);
    return (
      <div className="mx-auto max-w-md rounded-[26px] border border-indigo/10 bg-white/80 p-10 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-white/70">
          <Emblem className="h-16 w-16" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-indigo">
          One last step{f.firstName ? `, ${f.firstName}` : ""} 🦋
        </h2>
        <p className="mt-3 leading-relaxed text-indigo/75">
          Check your email to begin. We just sent a secure link to <strong className="text-indigo">{f.email}</strong> —
          tap it to open Day 1 and start The Command Shift.
        </p>

        <div className="mt-5 rounded-2xl border border-gold/40 bg-gold/[0.06] px-5 py-4 text-left">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-gold">Look for this email</p>
          <p className="mt-2 text-[14px] leading-relaxed text-indigo/85">
            <span className="text-indigo/60">From:</span> <strong>The Command Shift</strong> ·
            lccssupport@amilynnecarroll.com
            <br />
            <span className="text-indigo/60">Subject:</span> <strong>Confirm your sign-in</strong>
          </p>
          <p className="mt-3 rounded-xl border border-teal/30 bg-teal/[0.07] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-indigo/85">
            ⭐ <strong>Add lccssupport@amilynnecarroll.com to your contacts</strong> (or tap &ldquo;Not spam&rdquo; if it
            lands there) so every day&apos;s email reaches your inbox.
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-indigo/55">
            Arrives within a minute. If you don&apos;t see it, check <strong>Spam</strong> and <strong>Promotions</strong>.
          </p>
        </div>

        {inbox && (
          <a
            href={inbox.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-[15px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft"
          >
            {inbox.label} →
          </a>
        )}
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
          <label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">Mobile number</label>
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
        Free forever · Day 1 arrives in minutes by email · Unsubscribe anytime.
      </p>
    </form>
  );
}
