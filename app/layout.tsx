import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Command Shift — 21-Day Challenge",
  description:
    "From a scattered hustle to hard-won harmony — one clear command center where your mission, brand, and business align, on purpose. A free 21-day challenge for founders and coaches.",
  openGraph: {
    title: "The Command Shift — 21-Day Challenge",
    description:
      "Trade the scramble for one clear command center. A free 21-day challenge, one small aligned move a day.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
