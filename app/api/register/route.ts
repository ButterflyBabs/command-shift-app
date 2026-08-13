import { NextResponse } from "next/server";

/**
 * The Command Shift — registration → Global Control.
 *
 * Fires the challenge tag (creates/updates the contact by email, which enrolls
 * them into the 21-day workflow) and writes the contact's details:
 * firstName, lastName, email, phone, city, state, zip.
 *
 * Configuration (Vercel env vars — nothing is hard-coded or exposed to the browser):
 *   GLOBAL_CONTROL_API_KEY   Global Control API key (sent as X-API-KEY)
 *   GC_BASE                  optional, defaults to https://api.globalcontrol.io/api/ai
 *   GC_CHALLENGE_TAG_ID      id of the "lccs-challenge" tag that triggers the workflow
 *   GC_FIELD_MAP             JSON mapping field keys -> customFieldId, e.g.
 *                            {"city":"<id>","state":"<id>","zip":"<id>","phone":"<id>"}
 *
 * Best-effort: if Global Control isn't configured yet, the endpoint still returns ok
 * so registration confirms to the user. Nothing blocks the participant.
 *
 * Diagnostic: POST with ?debug=<DIAG_TOKEN> returns a NON-SECRET report of how the
 * Global Control round-trip went (env presence, field-map keys, the response shape,
 * whether a contact id resolved). Never exposes the API key or other contacts' data.
 */

const GC_BASE = process.env.GC_BASE || "https://api.globalcontrol.io/api/ai";
const DIAG_TOKEN = "lccsdiag-7Q2v9x";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
};

/** Recursively hunt for a Mongo-ish contact id anywhere in Global Control's response. */
function findContactId(data: unknown, depth = 0): string | null {
  if (!data || depth > 6) return null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const hit = findContactId(item, depth + 1);
      if (hit) return hit;
    }
    return null;
  }
  if (typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  // Prefer explicit contact-id keys at this level.
  const preferred = ["contactId", "contact_id", "_id", "id"];
  for (const k of preferred) {
    const v = o[k];
    if (typeof v === "string" && /^[a-f0-9]{16,}$/i.test(v)) return v;
    if (typeof v === "string" && v && (k === "contactId" || k === "contact_id")) return v;
  }
  // Then descend into likely containers, then everything else.
  const order = ["contact", "data", "result", "record", ...Object.keys(o)];
  for (const k of order) {
    const hit = findContactId(o[k], depth + 1);
    if (hit) return hit;
  }
  return null;
}

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
  const city = (body.city || "").trim();
  const state = (body.state || "").trim();
  const zip = (body.zip || "").trim();

  const missing = Object.entries({ firstName, lastName, email, phone, city, state, zip })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", missing }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.GLOBAL_CONTROL_API_KEY;
  const tagId = process.env.GC_CHALLENGE_TAG_ID;

  let fieldMap: Record<string, string> = {};
  try {
    fieldMap = JSON.parse(process.env.GC_FIELD_MAP || "{}");
  } catch {
    fieldMap = {};
  }

  if (!apiKey || !tagId) {
    const res = { ok: true, crm: "not_configured" as const };
    return NextResponse.json(
      debug
        ? { ...res, debug: { hasApiKey: !!apiKey, hasTagId: !!tagId, fieldMapKeys: Object.keys(fieldMap) } }
        : res
    );
  }

  const headers = { "Content-Type": "application/json", "X-API-KEY": apiKey };

  try {
    const fireRes = await fetch(`${GC_BASE}/tags/fire-tag/${encodeURIComponent(tagId)}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, firstName, lastName, phone }),
    });
    const fireData = await fireRes.json().catch(() => null);
    if (!fireRes.ok) {
      return NextResponse.json(
        { ok: false, error: "fire_tag_failed", status: fireRes.status, ...(debug ? { debug: { fireData } } : {}) },
        { status: 502 }
      );
    }

    const contactId = findContactId(fireData);
    const values: Record<string, string> = { city, state, zip, phone };
    const customFields = Object.entries(fieldMap)
      .filter(([key]) => values[key] !== undefined && values[key] !== "")
      .map(([key, customFieldId]) => ({ customFieldId, value: values[key] }));

    let fieldWriteStatus: number | null = null;
    if (contactId && customFields.length) {
      const putRes = await fetch(`${GC_BASE}/contacts/${encodeURIComponent(contactId)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ customFields }),
      });
      fieldWriteStatus = putRes.status;
    }

    const wrote = !!(contactId && customFields.length && fieldWriteStatus && fieldWriteStatus < 300);
    const crm = wrote ? "registered" : "tagged_only";

    const base = { ok: true, crm, ...(contactId ? { contactId } : {}) };
    if (debug) {
      return NextResponse.json({
        ...base,
        debug: {
          fieldMapKeys: Object.keys(fieldMap),
          customFieldsAttempted: customFields.length,
          contactIdResolved: !!contactId,
          fieldWriteStatus,
          fireResponseType: Array.isArray(fireData) ? "array" : typeof fireData,
          fireResponseTopKeys:
            fireData && typeof fireData === "object" && !Array.isArray(fireData)
              ? Object.keys(fireData as Record<string, unknown>)
              : undefined,
          fireResponseSample: fireData,
        },
      });
    }
    return NextResponse.json(base);
  } catch {
    return NextResponse.json({ ok: false, error: "crm_error" }, { status: 502 });
  }
}
