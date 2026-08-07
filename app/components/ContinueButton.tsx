"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function ContinueButton() {
  const [next, setNext] = useState<number | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem("cs_progress");
      if (p) {
        const done = JSON.parse(p) as Record<string, boolean>;
        const completedDays = Object.keys(done)
          .filter((k) => done[k])
          .map(Number);
        if (completedDays.length) {
          const highest = Math.max(...completedDays);
          setNext(Math.min(highest + 1, 21));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Link
      href={next ? `/day/${next}` : "/day/1"}
      className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-[30px] py-[15px] text-[15px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft"
    >
      {next ? `Continue — Day ${next} →` : "Begin Day 1 →"}
    </Link>
  );
}
