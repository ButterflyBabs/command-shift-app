"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserId } from "@/lib/supabase/client";
import { loadAllJournals, type EntryType } from "@/lib/store";
import { DAYS } from "@/lib/content";
import { Compass } from "../components/icons";

const LABEL: Record<EntryType, string> = {
  reflection: "Reflection",
  command_move: "Command Move",
  evening: "Evening Reflection",
};
const ORDER: EntryType[] = ["reflection", "command_move", "evening"];

export function JournalView() {
  const [entries, setEntries] = useState<{ day_number: number; entry_type: EntryType; content: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const uid = await getUserId();
      const all = await loadAllJournals(uid);
      setEntries(all.filter((e) => (e.content || "").trim()));
      setLoaded(true);
    })();
  }, []);

  const byDay = new Map<number, Record<string, string>>();
  entries.forEach((e) => {
    const d = byDay.get(e.day_number) || {};
    d[e.entry_type] = e.content;
    byDay.set(e.day_number, d);
  });
  const days = [...byDay.keys()].sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-[820px] px-[22px] pb-20 pt-8">
      <div className="mb-6 flex items-center justify-between border-b border-indigo/10 pb-5">
        <div className="flex items-center gap-3">
          <Compass className="h-8 w-8 text-gold" />
          <div>
            <h1 className="font-serif text-[clamp(26px,4vw,38px)] font-semibold leading-none">My Command Shift Journal</h1>
            <p className="mt-2 text-sm text-indigo/70">Everything you&apos;ve written, in one place.</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-full border border-indigo/15 bg-white/60 px-4 py-2 text-[13px] font-semibold text-indigo hover:border-gold"
        >
          Download / Print
        </button>
      </div>

      {!loaded && <p className="text-indigo/60">Loading your journal…</p>}

      {loaded && days.length === 0 && (
        <div className="rounded-[20px] border border-indigo/10 bg-white/70 p-8 text-center shadow-card">
          <p className="text-indigo/75">No journal entries yet. Open a day and use the Reflection, Command Move, or Evening journals — they&apos;ll gather here.</p>
          <Link href="/day/1" className="mt-5 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-indigo-deep shadow-soft hover:bg-gold-soft">
            Go to Day 1 →
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {days.map((n) => {
          const d = DAYS.find((x) => x.n === n);
          const rec = byDay.get(n)!;
          return (
            <div key={n} className="rounded-[20px] border border-indigo/10 bg-white/70 p-6 shadow-card">
              <div className="mb-3 flex items-baseline gap-3">
                <span className="font-serif text-lg font-semibold text-gold">Day {n}</span>
                {d && <span className="font-serif text-indigo">{d.focus}</span>}
              </div>
              <div className="space-y-3">
                {ORDER.filter((t) => rec[t]).map((t) => (
                  <div key={t}>
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal">{LABEL[t]}</div>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-indigo/85">{rec[t]}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-[13px] font-semibold text-teal hover:text-plum">← Home</Link>
      </div>
    </div>
  );
}
