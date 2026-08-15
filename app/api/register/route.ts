import { NextResponse } from "next/server";

/**
 * The Command Shift — registration → Global Control.
 *
 * Submits the contact to the challenge tag's form endpoint, which creates or
 * updates them by email and enrols them in the 21-day workflow.
 *
 * Configuration (Vercel env vars — nothing is hard-coded or exposed to the browser):
 *   GC_CHALLENGE_TAG_ID   id of the "lccs-challenge" tag that triggers the workflow
 *   GC_FORM_BASE          optional override of the submission endpoint
 *   GLOBAL_CONTROL_API_KEY optional; sent as X-API-KEY when present
 *
 * Verified against the live API on 2026-08-15:
 *   - POST /api/tag-form-submission/{tagId} works and needs no auth header.
 *   - The older /api/ai/tags/fire-tag/{tagId} returns HTTP 200 with an ERROR body
 *     ({"type":"error",...}), so any check based on res.ok reads failure as success.
 *     That is why this integration appeared to work while capturing nobody.
 *   - The endpoint accepts email, firstName, lastName and phone. Anything else —
 *     city, state, zip, nested customFields — is silently discarded, and Global
 *     Control has no native zip field at all. So we send only what it stores.
 *
 * Diagnostic: POST with ?debug=<DIAG_TOKEN> returns a NON-SECRET report of the
 * round-trip. It never exposes the API key or any other contact's data.
 */

const GC_FORM_BASE =
  process.env.GC_FORM_BASE || "https://api.globalcontrol.io/api/tag-form-submission";
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
  const phone = (body.phone || "").trim();

  const missing = Object.entries({ firstName, lastName, email, phone })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", missing }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const tagId = process.env.GC_CHALLENGE_TAG_ID;

  // A missing tag id is a configuration fault, not the participant's problem.
  // Let them through, but make the fault impossible to miss in the Vercel logs.
  if (!tagId) {
    console.error(
      `[register] NOT CONFIGURED — GC_CHALLENGE_TAG_ID is unset. Lead lost: ${email}`
    );
    const res = { ok: true, crm: "not_configured" as const };
    return NextResponse.json(debug ? { ...res, debug: { hasTagId: false } } : res);
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.GLOBAL_CONTROL_API_KEY) {
    headers["X-API-KEY"] = process.env.GLOBAL_CONTROL_API_KEY;
  }

  try {
    const gcRes = await fetch(`${GC_FORM_BASE}/${encodeURIComponent(tagId)}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, firstName, lastName, phone }),
    });

    const payload = await gcRes.json().catch(() => null);

    // Global Control returns HTTP 200 for failures and puts the real outcome in
    // the body. Success is {"type":"response","data":{"success":true}}. So we must
    // REQUIRE an explicit success — checking gcRes.ok passes on an error body.
    const succeeded = gcRes.ok && payload?.data?.success === true;

    if (!succeeded) {
      console.error(
        `[register] TAG SUBMIT FAILED for ${email} (status=${gcRes.status}) ` +
          `response=${JSON.stringify(payload)}`
      );
      const res = { ok: true, crm: "failed" as const, status: gcRes.status };
      return NextResponse.json(debug ? { ...res, debug: { payload } } : res);
    }

    const res = { ok: true, crm: "registered" as const };
    return NextResponse.json(debug ? { ...res, debug: { payload } } : res);
  } catch (err) {
    console.error(`[register] TAG SUBMIT ERROR for ${email}:`, err);
    const res = { ok: true, crm: "error" as const };
    return NextResponse.json(debug ? { ...res, debug: { message: String(err) } } : res);
  }
}
