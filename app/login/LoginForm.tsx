"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Emblem } from "../components/icons";

export function LoginForm({ next = "/day/1" }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setState("busy");
    try {
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` : undefined;
      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
      });
      if (error) {
        setError("Something went wrong sending your link. Please try again.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="mx-auto max-w-md rounded-[26px] border border-indigo/10 bg-white/80 p-10 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-white/70">
          <Emblem className="h-12 w-12" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-indigo">Check your email 🦋</h2>
        <p className="mt-3 leading-relaxed text-indigo/75">
          We sent a sign-in link to <strong>{email}</strong>. Tap it to pick up your Command Shift on this device.
        </p>
        <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/[0.06] px-5 py-3 text-left text-[13px] leading-relaxed text-indigo/80">
          Look for an email from <strong>The Command Shift</strong> · lccssupport@amilynnecarroll.com. ⭐ Add that
          address to your contacts so it doesn&apos;t go to spam — and check <strong>Spam / Promotions</strong> if it&apos;s
          not there within a minute.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-[26px] border border-indigo/10 bg-white/80 p-8 shadow-card sm:p-10">
      <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-indigo/80">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 text-[15px] text-indigo outline-none focus:ring-2 focus:ring-gold/60"
      />
      {error && <p className="mt-3 text-sm text-plum">{error}</p>}
      <button
        type="submit"
        disabled={state === "busy"}
        className="mt-5 w-full rounded-full bg-gold px-8 py-4 text-[15px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft disabled:opacity-70"
      >
        {state === "busy" ? "Sending your link…" : "Email me a sign-in link →"}
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-indigo/55">
        No password needed. We&apos;ll email you a secure one-tap link.
      </p>
    </form>
  );
}
