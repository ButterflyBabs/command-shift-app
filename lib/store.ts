"use client";

/**
 * Persistence layer for The Command Shift.
 * When signed in, reads/writes the shared Supabase project (cs_* tables, RLS-scoped).
 * When anonymous, uses localStorage — and syncs it up on first sign-in.
 */
import { createClient } from "@/lib/supabase/client";
import { DAY_OUTPUT } from "@/lib/content";

export type EntryType = "reflection" | "evening" | "command_move";

const LS_PROGRESS = "cs_progress";
const LS_LAYOUT = "cs_layout";
const jkey = (n: number, t: EntryType) => `cs_j_${n}_${t}`;
const okey = (k: string) => `cs_out_${k}`;

/* ---------- progress ---------- */
export async function loadProgress(uid: string | null): Promise<Record<number, boolean>> {
  if (uid) {
    const { data } = await createClient()
      .from("cs_day_progress")
      .select("day_number, completed_at")
      .eq("user_id", uid);
    const m: Record<number, boolean> = {};
    (data || []).forEach((r: { day_number: number; completed_at: string | null }) => {
      if (r.completed_at) m[r.day_number] = true;
    });
    return m;
  }
  try {
    return JSON.parse(localStorage.getItem(LS_PROGRESS) || "{}");
  } catch {
    return {};
  }
}

export async function setDayComplete(uid: string | null, day: number, done: boolean) {
  if (uid) {
    await createClient()
      .from("cs_day_progress")
      .upsert(
        { user_id: uid, day_number: day, completed_at: done ? new Date().toISOString() : null, updated_at: new Date().toISOString() },
        { onConflict: "user_id,day_number" }
      );
    return;
  }
  let m: Record<number, boolean> = {};
  try {
    m = JSON.parse(localStorage.getItem(LS_PROGRESS) || "{}");
  } catch {}
  if (done) m[day] = true;
  else delete m[day];
  localStorage.setItem(LS_PROGRESS, JSON.stringify(m));
}

/* ---------- journals ---------- */
export async function loadJournal(uid: string | null, day: number, type: EntryType): Promise<string> {
  if (uid) {
    const { data } = await createClient()
      .from("cs_journal_entries")
      .select("content")
      .eq("user_id", uid)
      .eq("day_number", day)
      .eq("entry_type", type)
      .maybeSingle();
    return (data?.content as string) || "";
  }
  try {
    return localStorage.getItem(jkey(day, type)) || "";
  } catch {
    return "";
  }
}

export async function saveJournal(uid: string | null, day: number, type: EntryType, content: string) {
  if (uid) {
    await createClient()
      .from("cs_journal_entries")
      .upsert(
        { user_id: uid, day_number: day, entry_type: type, content, updated_at: new Date().toISOString() },
        { onConflict: "user_id,day_number,entry_type" }
      );
    return;
  }
  localStorage.setItem(jkey(day, type), content);
}

/** All entries (for the /journal page). */
export async function loadAllJournals(
  uid: string | null
): Promise<{ day_number: number; entry_type: EntryType; content: string }[]> {
  if (uid) {
    const { data } = await createClient()
      .from("cs_journal_entries")
      .select("day_number, entry_type, content")
      .eq("user_id", uid)
      .order("day_number", { ascending: true });
    return (data || []) as { day_number: number; entry_type: EntryType; content: string }[];
  }
  const out: { day_number: number; entry_type: EntryType; content: string }[] = [];
  for (let n = 1; n <= 21; n++) {
    (["reflection", "evening", "command_move"] as EntryType[]).forEach((t) => {
      const v = typeof localStorage !== "undefined" ? localStorage.getItem(jkey(n, t)) : null;
      if (v) out.push({ day_number: n, entry_type: t, content: v });
    });
  }
  return out;
}

/* ---------- layout ---------- */
export async function loadLayout(uid: string | null): Promise<string[] | null> {
  if (uid) {
    const { data } = await createClient()
      .from("cs_card_layouts")
      .select("layout")
      .eq("user_id", uid)
      .maybeSingle();
    return (data?.layout as string[]) || null;
  }
  try {
    return JSON.parse(localStorage.getItem(LS_LAYOUT) || "null");
  } catch {
    return null;
  }
}

export async function saveLayout(uid: string | null, layout: string[]) {
  if (uid) {
    await createClient()
      .from("cs_card_layouts")
      .upsert({ user_id: uid, layout, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    return;
  }
  localStorage.setItem(LS_LAYOUT, JSON.stringify(layout));
}

export function clearLayoutLocal() {
  try {
    localStorage.removeItem(LS_LAYOUT);
  } catch {}
}

/* ---------- structured outputs (Command Suite seed) ---------- */
export async function loadOutput(uid: string | null, key: string): Promise<string> {
  if (uid) {
    const { data } = await createClient()
      .from("cs_outputs")
      .select("value_text")
      .eq("user_id", uid)
      .eq("key", key)
      .maybeSingle();
    return (data?.value_text as string) || "";
  }
  try {
    return localStorage.getItem(okey(key)) || "";
  } catch {
    return "";
  }
}

export async function saveOutput(uid: string | null, key: string, valueText: string, day?: number) {
  if (uid) {
    await createClient()
      .from("cs_outputs")
      .upsert(
        { user_id: uid, key, value_text: valueText, day_number: day ?? null, updated_at: new Date().toISOString() },
        { onConflict: "user_id,key" }
      );
    return;
  }
  localStorage.setItem(okey(key), valueText);
}

/* ---------- drip: one day at a time ---------- */
function localDateISO(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** The participant's start date (YYYY-MM-DD). From cs_participants when signed in; else local. */
export async function getStartDate(uid: string | null): Promise<string> {
  if (uid) {
    const { data } = await createClient()
      .from("cs_participants")
      .select("start_date")
      .eq("user_id", uid)
      .maybeSingle();
    if (data?.start_date) {
      try {
        localStorage.setItem("cs_start", data.start_date as string);
      } catch {}
      return data.start_date as string;
    }
  }
  try {
    let d = localStorage.getItem("cs_start");
    if (!d) {
      d = localDateISO();
      localStorage.setItem("cs_start", d);
    }
    return d;
  } catch {
    return localDateISO();
  }
}

/** Highest day number currently unlocked (1..21), by calendar days since start. */
export function unlockedThrough(startISO: string): number {
  const [y, m, d] = startISO.split("-").map(Number);
  const start = new Date(y, (m || 1) - 1, d || 1);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return Math.max(1, Math.min(days + 1, 21));
}

/** Friendly date a given day unlocks (e.g., "Monday, Aug 18"). */
export function unlockLabel(startISO: string, dayN: number): string {
  const [y, m, d] = startISO.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, (d || 1) + (dayN - 1));
  return dt.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

/* ---------- one-time sync of anonymous localStorage → cloud ---------- */
export async function syncLocalToCloud(uid: string) {
  if (!uid) return;
  try {
    if (localStorage.getItem("cs_synced") === "1") return;
    const s = createClient();

    // progress
    let prog: Record<string, boolean> = {};
    try {
      prog = JSON.parse(localStorage.getItem(LS_PROGRESS) || "{}");
    } catch {}
    const rows = Object.keys(prog)
      .filter((k) => prog[k])
      .map((k) => ({ user_id: uid, day_number: Number(k), completed_at: new Date().toISOString() }));
    if (rows.length) await s.from("cs_day_progress").upsert(rows, { onConflict: "user_id,day_number" });

    // layout
    const layout = localStorage.getItem(LS_LAYOUT);
    if (layout) await s.from("cs_card_layouts").upsert({ user_id: uid, layout: JSON.parse(layout) }, { onConflict: "user_id" });

    // journals
    const entries: { user_id: string; day_number: number; entry_type: EntryType; content: string }[] = [];
    for (let n = 1; n <= 21; n++) {
      (["reflection", "evening", "command_move"] as EntryType[]).forEach((t) => {
        const v = localStorage.getItem(jkey(n, t));
        if (v) entries.push({ user_id: uid, day_number: n, entry_type: t, content: v });
      });
    }
    if (entries.length) await s.from("cs_journal_entries").upsert(entries, { onConflict: "user_id,day_number,entry_type" });

    // structured outputs
    const outs: { user_id: string; key: string; value_text: string }[] = [];
    Object.values(DAY_OUTPUT).forEach((meta) => {
      const v = localStorage.getItem(okey(meta.key));
      if (v) outs.push({ user_id: uid, key: meta.key, value_text: v });
    });
    if (outs.length) await s.from("cs_outputs").upsert(outs, { onConflict: "user_id,key" });

    localStorage.setItem("cs_synced", "1");
  } catch {
    /* best-effort */
  }
}
