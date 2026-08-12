import type { Metadata } from "next";
import { JournalView } from "./JournalView";

export const metadata: Metadata = {
  title: "My Journal — The Command Shift",
  description: "All your Command Shift reflections in one place.",
};

export default function JournalPage() {
  return (
    <main>
      <JournalView />
    </main>
  );
}
