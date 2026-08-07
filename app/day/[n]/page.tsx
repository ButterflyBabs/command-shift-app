import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DAYS, getDay } from "@/lib/content";
import { DayView } from "@/app/components/DayView";

export const dynamicParams = false;

export function generateStaticParams() {
  return DAYS.map((d) => ({ n: String(d.n) }));
}

export function generateMetadata({ params }: { params: { n: string } }): Metadata {
  const day = getDay(Number(params.n));
  if (!day) return { title: "The Command Shift" };
  return {
    title: `Day ${day.n}: ${day.focus} — The Command Shift`,
    description: day.focusDesc,
  };
}

export default function DayPage({ params }: { params: { n: string } }) {
  const n = Number(params.n);
  const day = getDay(n);
  if (!day) notFound();
  return (
    <main>
      <DayView day={day} />
    </main>
  );
}
