"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Shared Meta Pixel + Google Analytics (Babs, 2026-09-27: one pixel and one Analytics account for
// every site). PREFIXES limits it to public pages; participants' days and journals are never tracked.
const SHARED_META_PIXEL_ID = "1084205054362982"; // "AmiLynne Carroll Websites", Sacred Kaleidoscope Community
const GA_MEASUREMENT_ID = "G-EK2T4YVFF4"; // shared GA4 property, account "Sacred Kaleidoscope Community LLC"
const PREFIXES: string[] | null = ["/register"];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", name, params);
  window.gtag?.("event", name === "CompleteRegistration" ? "sign_up" : name === "Lead" ? "generate_lead" : name, params ?? {});
}

export function Tracking() {
  const pathname = usePathname();
  if (PREFIXES && !PREFIXES.some((p) => pathname === p || pathname?.startsWith(p + "/"))) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${SHARED_META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
    </>
  );
}

