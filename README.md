# The Command Shift — 21-Day Challenge App

A standalone Next.js app that delivers the LifeCharter "Command Shift" 21-day challenge:
a Welcome/Home page and 21 day pages, each with a drag-and-drop card dashboard
(Today's Focus, Daily Audio, Reflection Prompt, Aligned Action, 21-Day Progress,
Morning Intention, Text Nudge, Evening Reflection, and Today's Command Move).

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- `@dnd-kit` for accessible drag-and-drop (keyboard + pointer)
- Content for all 21 days in `lib/content.ts`

## Run locally
```bash
npm install
npm run dev
```

## Notes / next phase
- Progress, card layout, and journal entries currently save to the **browser** (localStorage).
  The next phase swaps this for **Supabase** accounts so they persist across devices,
  and adds **drip unlock** (one day at a time) + auth.
- Audio uses a **demo player**. Drop each day's recording URL into `audioUrl` in
  `lib/content.ts` and wire the `<audio>` element to enable real playback.
- Replace the Alignment Architect bio placeholder on the Home page with the real bio + headshot.

Head Up — Wings Out. 🦋
