import { NextResponse } from "next/server";

/**
 * The Command Shift — registration → the Command Suite's own CRM.
 *
 * Posts the registrant to the Suite form "Command Shift Challenge registration", which creates
 * or updates the contact by email, tags them command-shift-registered and starts the Command
 * Shift daily-email campaign (welcome, Day 1 to Day 21, next doorway). Until 2026-10-05 this
 * tagged Global Control instead; that workflow is retired.
 *
 * Configuration (optional Vercel env vars; the defaults below are the live form):
 *   SUITE_FORM_BASE   the Suite's public form endpoint
 *   SUITE_FORM_ID     id of the registration form in the Suite
 *
 * Diagnostic: POST with ?debug=<DIAG_TOKEN> returns a NON-SECRET report of the round-trip.
 */

const SUITE_FORM_BASE = process.env.SUITE_FORM_BASE || "https://lccommandsuite.com/api/forms";
const SUITE_FORM_ID = process.env.SUITE_FORM_ID || "f3130be5-9b35-4f58-9fad-a4bc2cca6428";
const DIAG_TOKEN = "lccsdiag-7Q2v9x";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export async function POST(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === DIAG_TOKEN;

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim(); // optional — kept for sales follow-up, not required

  const missing = Object.entries({ firstName, lastName, email })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", missing }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // The Suite's own CRM (since 2026-10-05; this used to tag Global Control). The form saves the
  // contact, tags them command-shift-registered and starts the Command Shift daily emails.
  try {
    const res = await fetch(`${SUITE_FORM_BASE}/${SUITE_FORM_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, ...(phone ? { phone } : {}), _page: "https://command-shift-app.vercel.app/register" }),
    });
    const payload = await res.json().catch(() => null);
    if (!res.ok || payload?.ok !== true) {
      console.error(`[register] SUITE FORM FAILED for ${email} (status=${res.status}) response=${JSON.stringify(payload)}`);
      const out = { ok: true, crm: "failed" as const, status: res.status };
      return NextResponse.json(debug ? { ...out, debug: { payload } } : out);
    }
    const out = { ok: true, crm: "registered" as const };
    return NextResponse.json(debug ? { ...out, debug: { payload } } : out);
  } catch (err) {
    console.error(`[register] SUITE FORM ERROR for ${email}:`, err);
    const out = { ok: true, crm: "error" as const };
    return NextResponse.json(debug ? { ...out, debug: { message: String(err) } } : out);
  }
}
