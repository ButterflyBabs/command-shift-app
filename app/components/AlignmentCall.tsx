"use client";

import { useState } from "react";

/**
 * Weekly Alignment Call banner shown on every daily page.
 *
 * - Hot-linked Zoom join button (opens in a new tab).
 * - "Add to my calendar" as a RECURRING weekly event (Thursdays, 1 PM MT):
 *     • Google           → calendar.google.com template with recur=RRULE:FREQ=WEEKLY;BYDAY=TH
 *     • Outlook/Microsoft → static /alignment-call.ics (Outlook imports the full recurring series)
 *     • Apple             → static /alignment-call.ics (RRULE inside; opens in Calendar)
 */

const ZOOM_URL =
  "https://us02web.zoom.us/j/87052226903?pwd=4KdrLaVD6cpAHgGLawKVh5voPFoJQn.1";

const TITLE = "Command Shift Weekly Alignment Call";
const DETAILS =
  "Your weekly Alignment Call with Babs and the Command Shift community. Open attendance — come connect live, ask questions, and get support as you make your shift. Join on Zoom: " +
  ZOOM_URL;

// Series anchor: Thursday, Aug 13 2026, 1:00–2:00 PM (naive local; ctz/TZID sets the zone).
const G_START = "20260813T130000";
const G_END = "20260813T140000";

const googleUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent(TITLE) +
  "&dates=" + G_START + "/" + G_END +
  "&ctz=America/Denver" +
  "&recur=" + encodeURIComponent("RRULE:FREQ=WEEKLY;BYDAY=TH") +
  "&details=" + encodeURIComponent(DETAILS) +
  "&location=" + encodeURIComponent(ZOOM_URL);

export function AlignmentCall() {
  const [open, setOpen] = useState(false);

  const calBtn =
    "inline-flex items-center gap-1.5 rounded-full border border-indigo/15 bg-white/80 px-3.5 py-2 text-[12.5px] font-semibold text-indigo transition hover:border-gold hover:text-plum";

  return (
    <div className="mb-4 rounded-[18px] border border-gold/40 bg-gradient-to-r from-gold/[0.09] via-white/40 to-teal/[0.07] px-5 py-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold/20 text-lg">
            📅
          </span>
          <div>
            <div className="font-serif text-[16px] font-semibold text-indigo">
              Weekly Alignment Call
            </div>
            <div className="mt-0.5 text-[13px] leading-snug text-indigo/70">
              Open to everyone · <strong className="text-indigo/85">Thursdays, 1:00 PM Mountain Time</strong> · live with Babs on Zoom
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={ZOOM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[13px] font-semibold text-indigo-deep shadow-soft transition hover:bg-gold-soft"
          >
            Join the Zoom →
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2.5 text-[13px] font-semibold text-plum transition hover:bg-gold/10"
            aria-expanded={open}
          >
            + Add to my calendar
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 border-t border-indigo/10 pt-3.5">
          <span className="text-[12px] font-medium text-indigo/55">Recurring, every Thursday:</span>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={calBtn}>
            Google Calendar
          </a>
          <a href="/alignment-call.ics" download className={calBtn}>
            Outlook / Microsoft (.ics)
          </a>
          <a href="/alignment-call.ics" download className={calBtn}>
            Apple Calendar (.ics)
          </a>
        </div>
      )}
    </div>
  );
}
