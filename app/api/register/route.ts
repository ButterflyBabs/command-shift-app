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
 *                            (phone only if you store it as a custom field; otherwise it's
 *                            sent in the fire-tag body below and can be omitted here.)
 *
 * Best-effort: if Global Control isn't configured yet, the endpoint still returns ok
 * so registration confirms to the user. Nothing blocks the participant.
 */

const GC_BASE = process.env.GC_BASE || "https://api.globalcontrol.io/api/ai";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
};

function pickContactId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const candidates = [
    o._id,
    o.id,
    o.contactId,
    (o.contact as Record<string, unknown> | undefined)?._id,
    (o.data as Record<string, unknown> | undefined)?._id,
    (o.data as Record<string, unknown> | undefined)?.id,
  ];
  for (const c of candidates) if (typeof c === "string" && c) return c;
  return null;
}

export async function POST(req: Request) {
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

  // All fields are required.
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

  // If Global Control isn't wired yet, accept the submission so the UX still works.
  if (!apiKey || !tagId) {
    return NextResponse.json({ ok: true, crm: "not_configured" });
  }

  const headers = { "Content-Type": "application/json", "X-API-KEY": apiKey };

  try {
    // 1) Fire the tag — creates/updates the contact by email, applies lccs-challenge,
    //    and (via the workflow's tag trigger) enrolls them in the 21-day sequence.
    const fireRes = await fetch(`${GC_BASE}/tags/fire-tag/${encodeURIComponent(tagId)}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, firstName, lastName, phone }),
    });
    const fireData = await fireRes.json().catch(() => null);
    if (!fireRes.ok) {
      return NextResponse.json({ ok: false, error: "fire_tag_failed", status: fireRes.status }, { status: 502 });
    }

    // 2) Write contact detail fields if we can resolve the contact id + a field map.
    let fieldMap: Record<string, string> = {};
    try {
      fieldMap = JSON.parse(process.env.GC_FIELD_MAP || "{}");
    } catch {
      fieldMap = {};
    }

    const contactId = pickContactId(fireData);
    if (contactId && Object.keys(fieldMap).length) {
      const values: Record<string, string> = { city, state, zip, phone };
      const customFields = Object.entries(fieldMap)
        .filter(([key]) => values[key] !== undefined && values[key] !== "")
        .map(([key, customFieldId]) => ({ customFieldId, value: values[key] }));

      if (customFields.length) {
        await fetch(`${GC_BASE}/contacts/${encodeURIComponent(contactId)}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ customFields }),
        });
      }
      return NextResponse.json({ ok: true, crm: "registered", contactId });
    }

    return NextResponse.json({ ok: true, crm: "tagged_only" });
  } catch {
    return NextResponse.json({ ok: false, error: "crm_error" }, { status: 502 });
  }
}
