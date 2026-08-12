"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserId } from "@/lib/supabase/client";
import { getStartDate, unlockedThrough } from "@/lib/store";

export function ContinueButton() {
  const [href, setHref] = useState<string>("/register");
  const [label, setLabel] = useState<string>("Register free →");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const uid = await getUserId();
        // A start date exists (cloud row, or a locally-stored one) only once
        // someone has actually begun. New visitors → registration.
        const hasLocalStart =
          typeof localStorage !== "undefined" && !!localStorage.getItem("cs_start");
        if (!uid && !hasLocalStart) return;
        const start = await getStartDate(uid);
        if (!alive) return;
        const today = unlockedThrough(start);
        setHref(`/day/${today}`);
        setLabel(today === 1 ? "Begin — Day 1 →" : `Continue — Day ${today} →`);
      } catch {
        /* ignore — default to register */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Link
      href={href}
      className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-[30px] py-[15px] text-[15px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft"
    >
      {label}
    </Link>
  );
}
