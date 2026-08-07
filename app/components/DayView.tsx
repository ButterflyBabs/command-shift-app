"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Day } from "@/lib/content";
import { ProgressRing } from "./ProgressRing";
import {
  Compass,
  IconTarget,
  IconHeadphones,
  IconBook,
  IconSun,
  IconChat,
  IconMoon,
  IconCompassMove,
} from "./icons";

const TOTAL = 21;
const DEFAULT_ORDER = [
  "focus",
  "audio",
  "reflect",
  "action",
  "progress",
  "intention",
  "nudge",
  "evening",
  "move",
];
const LS_PROGRESS = "cs_progress";
const LS_LAYOUT = "cs_layout";

/* ---------------- demo audio player ---------------- */
function AudioPlayer({ duration }: { duration: string }) {
  const total = useMemo(() => {
    const [m, s] = duration.split(":").map(Number);
    return m * 60 + s;
  }, [duration]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPos(0);
    setPlaying(false);
    if (timer.current) clearInterval(timer.current);
  }, [duration]);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setPos((p) => {
          if (p + 1 >= total) {
            setPlaying(false);
            return total;
          }
          return p + 1;
        });
      }, 120);
    } else if (timer.current) {
      clearInterval(timer.current);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, total]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const remaining = total - pos;

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold shadow-soft"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-indigo-deep" fill="currentColor">
            {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
        <div
          className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-indigo/15"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setPos(Math.round(((e.clientX - r.left) / r.width) * total));
          }}
        >
          <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${(pos / total) * 100}%` }} />
        </div>
        <div className="min-w-[42px] text-right text-[13px] tabular-nums text-indigo/70">{fmt(remaining)}</div>
      </div>
      <p className="mt-2.5 text-center text-xs text-indigo/55">Listen to today&apos;s lesson · demo player (placeholder audio)</p>
    </div>
  );
}

/* ---------------- card chrome ---------------- */
function SortableCard({
  id,
  num,
  title,
  span2,
  children,
}: {
  id: string;
  num: number;
  title: string;
  span2?: boolean;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`rounded-[20px] border border-indigo/10 bg-white/70 p-[22px] shadow-card ${
        span2 ? "sm:col-span-2" : ""
      } ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-indigo text-[13px] font-bold text-ivory">
          {num}
        </span>
        <h3 className="flex-1 font-serif text-[16px] font-semibold text-indigo">{title}</h3>
        <button
          {...listeners}
          aria-label={`Reorder ${title}`}
          className="cursor-grab rounded-md px-1 py-0.5 text-[18px] leading-none text-indigo/30 hover:bg-gold/10 hover:text-gold"
        >
          ⠿
        </button>
      </div>
      {children}
    </div>
  );
}

/* ---------------- main ---------------- */
export function DayView({ day }: { day: Day }) {
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [reflectText, setReflectText] = useState("");
  const [eveningText, setEveningText] = useState("");
  const [reflectOpen, setReflectOpen] = useState(false);
  const [eveningOpen, setEveningOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // load persisted state
  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem(LS_PROGRESS);
      if (p) setCompleted(JSON.parse(p));
      const l = localStorage.getItem(LS_LAYOUT);
      if (l) {
        const parsed = JSON.parse(l);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) setOrder(parsed);
      }
      setReflectText(localStorage.getItem(`cs_j_${day.n}_reflect`) || "");
      setEveningText(localStorage.getItem(`cs_j_${day.n}_evening`) || "");
    } catch {
      /* ignore */
    }
  }, [day.n]);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const percent = Math.round((completedCount / TOTAL) * 100);
  const isDone = !!completed[day.n];

  function saveCompleted(next: Record<number, boolean>) {
    setCompleted(next);
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(next));
    } catch {}
  }
  function toggleDone() {
    saveCompleted({ ...completed, [day.n]: !completed[day.n] });
  }
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setOrder((items) => {
        const next = arrayMove(items, items.indexOf(String(active.id)), items.indexOf(String(over.id)));
        try {
          localStorage.setItem(LS_LAYOUT, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }
  function resetLayout() {
    setOrder(DEFAULT_ORDER);
    try {
      localStorage.removeItem(LS_LAYOUT);
    } catch {}
  }
  function saveJournal(kind: "reflect" | "evening", val: string) {
    if (kind === "reflect") setReflectText(val);
    else setEveningText(val);
    try {
      localStorage.setItem(`cs_j_${day.n}_${kind}`, val);
    } catch {}
  }

  const cardContent: Record<string, { num: number; title: string; span2?: boolean; body: ReactNode }> = {
    focus: {
      num: 1,
      title: "Today's Focus",
      body: (
        <div className="py-1 text-center">
          <div className="mb-2.5 flex justify-center"><IconTarget className="h-9 w-9 text-gold" /></div>
          <div className="font-serif text-[20px] font-semibold">{day.focus}</div>
          <div className="mt-2 leading-relaxed text-indigo/70">{day.focusDesc}</div>
        </div>
      ),
    },
    audio: {
      num: 2,
      title: "Daily Audio",
      body: (
        <div>
          <div className="mb-2.5 flex justify-center"><IconHeadphones className="h-9 w-9 text-gold" /></div>
          <div className="mb-3.5 text-center font-serif text-[18px] font-semibold">{day.audioTitle}</div>
          <AudioPlayer duration={day.audioDuration} />
        </div>
      ),
    },
    reflect: {
      num: 3,
      title: "Reflection Prompt",
      body: (
        <div>
          <div className="mb-2 flex justify-center"><IconBook className="h-9 w-9 text-gold" /></div>
          <div className="mb-3.5 text-center font-serif text-[18px] font-semibold leading-snug">{day.reflection}</div>
          <div className="text-center">
            <button
              onClick={() => setReflectOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/70 px-[18px] py-2.5 text-[13px] font-semibold text-plum hover:bg-gold/10"
            >
              {reflectOpen ? "Close Journal" : "Open Journal"}
            </button>
          </div>
          {reflectOpen && (
            <textarea
              value={reflectText}
              onChange={(e) => saveJournal("reflect", e.target.value)}
              placeholder="Write freely — this is only for you…"
              className="mt-3 min-h-[90px] w-full resize-y rounded-[14px] border border-indigo/10 bg-white/70 p-3 text-sm outline-none focus:ring-2 focus:ring-gold/60"
            />
          )}
        </div>
      ),
    },
    action: {
      num: 4,
      title: "Aligned Action",
      body: (
        <div>
          <div className="leading-relaxed text-indigo">{day.action}</div>
          <div className="mt-3 border-t border-indigo/10 pt-3 text-center text-sm italic text-indigo/60">
            {day.actionPrinciple}
          </div>
          <button
            onClick={toggleDone}
            className={`mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold ${
              isDone ? "bg-teal text-white" : "bg-teal/10 text-teal"
            }`}
          >
            <span>{isDone ? "✓" : "○"}</span>
            {isDone ? "Completed" : "Mark today complete"}
          </button>
        </div>
      ),
    },
    progress: {
      num: 5,
      title: "21-Day Progress",
      span2: true,
      body: (
        <div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: TOTAL }, (_, i) => i + 1).map((i) => {
              const done = !!completed[i];
              const current = i === day.n;
              const base = "flex h-[34px] w-[34px] items-center justify-center rounded-full text-xs font-bold border-[1.5px]";
              const cls = done
                ? "bg-gold border-gold text-white"
                : current
                ? "bg-indigo border-indigo text-white"
                : "border-indigo/20 text-indigo/45";
              return (
                <Link key={i} href={`/day/${i}`} className={`${base} ${cls} ${current ? "ring-2 ring-gold/45" : ""}`}>
                  {done ? "✓" : i}
                </Link>
              );
            })}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-[18px] text-[13px] text-indigo/70">
            <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-gold" /> Completed</span>
            <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-indigo" /> Today</span>
            <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border-[1.5px] border-indigo/30" /> Upcoming</span>
          </div>
        </div>
      ),
    },
    intention: {
      num: 6,
      title: "Morning Intention",
      body: (
        <div className="flex items-start gap-3">
          <IconSun className="h-9 w-9 flex-none text-gold" />
          <div className="font-serif text-[16px] leading-snug text-indigo">{day.morningIntention}</div>
        </div>
      ),
    },
    nudge: {
      num: 7,
      title: "Text Nudge",
      body: (
        <div className="flex items-start gap-3">
          <IconChat className="h-9 w-9 flex-none text-gold" />
          <div className="font-serif text-[16px] leading-snug text-indigo">{day.textNudge}</div>
        </div>
      ),
    },
    evening: {
      num: 8,
      title: "Evening Reflection",
      body: (
        <div>
          <div className="mb-3 flex items-start gap-3">
            <IconMoon className="h-9 w-9 flex-none text-gold" />
            <div className="font-serif text-[16px] leading-snug text-indigo">{day.eveningReflection}</div>
          </div>
          <div className="text-center">
            <button
              onClick={() => setEveningOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/70 px-[18px] py-2.5 text-[13px] font-semibold text-plum hover:bg-gold/10"
            >
              {eveningOpen ? "Close Journal" : "Open Journal"}
            </button>
          </div>
          {eveningOpen && (
            <textarea
              value={eveningText}
              onChange={(e) => saveJournal("evening", e.target.value)}
              placeholder="How did today go?…"
              className="mt-3 min-h-[90px] w-full resize-y rounded-[14px] border border-indigo/10 bg-white/70 p-3 text-sm outline-none focus:ring-2 focus:ring-gold/60"
            />
          )}
        </div>
      ),
    },
    move: {
      num: 9,
      title: "Focus for Today",
      body: (
        <div className="text-center">
          <div className="mb-2 flex justify-center"><IconCompassMove className="h-9 w-9 text-gold" /></div>
          <div className="font-serif text-[18px] font-semibold">Today&apos;s Command Move</div>
          <div className="mt-2 leading-relaxed text-indigo/70">{day.commandMove}</div>
        </div>
      ),
    },
  };

  return (
    <div className="mx-auto max-w-[1180px] px-[22px] pb-16 pt-8">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-5 border-b border-indigo/10 px-1 pb-5">
        <div className="flex items-center gap-3">
          <Compass className="h-9 w-9 text-gold" />
          <div>
            <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-semibold leading-none">The Command Shift</h1>
            <div className="mt-1.5 font-serif text-[22px] text-gold">Day {day.n} of 21</div>
            <div className="mt-2 text-sm text-indigo/70">Week {day.week}: {day.weekTheme}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing percent={mounted ? percent : 0} />
          <div>
            <div className="text-[15px] font-bold">{mounted ? completedCount : 0} of 21 Days Completed</div>
            <div className="mt-1.5 text-[13px] text-indigo/65">{21 - day.n} Days Remaining</div>
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <Link href="/" className="text-[13px] font-semibold text-teal hover:text-plum">← Home</Link>
        <button
          onClick={resetLayout}
          className="rounded-full border border-indigo/10 bg-white/60 px-4 py-2 text-[13px] font-semibold text-indigo hover:border-gold"
        >
          Reset layout
        </button>
      </div>

      {/* cards */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 items-start gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {order.map((key) => {
              const c = cardContent[key];
              return (
                <SortableCard key={key} id={key} num={c.num} title={c.title} span2={c.span2}>
                  {c.body}
                </SortableCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* day nav */}
      <div className="mt-8 flex items-center justify-between">
        {day.n > 1 ? (
          <Link href={`/day/${day.n - 1}`} className="rounded-full border border-indigo/15 px-5 py-2.5 text-sm font-semibold text-indigo hover:border-gold">
            ← Day {day.n - 1}
          </Link>
        ) : <span />}
        {day.n < 21 ? (
          <Link href={`/day/${day.n + 1}`} className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-indigo-deep shadow-soft hover:bg-gold-soft">
            Day {day.n + 1} →
          </Link>
        ) : (
          <Link href="/" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-indigo-deep shadow-soft hover:bg-gold-soft">
            Finish → Home
          </Link>
        )}
      </div>

      <p className="mt-10 text-center text-[13px] text-indigo/55">Head Up — Wings Out 🦋</p>
    </div>
  );
}
