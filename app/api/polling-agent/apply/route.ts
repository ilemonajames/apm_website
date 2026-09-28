import { NextResponse } from "next/server";
import { cleanText, getCurrentMember, getD1, makeReference } from "@/lib/member-auth";
export async function POST(request: Request) {
  try {
    const member = await getCurrentMember(); if (!member) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    if (member.status !== "approved" || !member.email_verified_at) return NextResponse.json({ error: "Polling-agent applications require verified email and approved membership." }, { status: 403 });
    const body = await request.json() as Record<string, unknown>, electionId = cleanText(body.electionId), pollingUnitId = cleanText(body.pollingUnitId), db = getD1();
    if (!electionId || !pollingUnitId || ![true, "true", "on"].includes(body.availabilityConfirmed as never)) return NextResponse.json({ error: "Select an election and polling unit, then confirm availability." }, { status: 400 });
    const valid = await db.prepare(`SELECT e.id FROM elections e JOIN inec_locations p ON p.id = ? AND p.type = 'polling_unit' WHERE e.id = ? AND e.status = 'open' AND (e.application_deadline IS NULL OR e.application_deadline > ?)`).bind(pollingUnitId, electionId, Date.now()).first();
    if (!valid) return NextResponse.json({ error: "That election or polling unit is not currently available." }, { status: 400 });
    const reference = makeReference("AGT"), now = Date.now();
    try { await db.prepare("INSERT INTO polling_agent_applications (id, application_reference, member_id, election_id, polling_unit_id, status, experience, availability_confirmed, submitted_at, updated_at) VALUES (?, ?, ?, ?, ?, 'submitted', ?, 1, ?, ?)").bind(crypto.randomUUID(), reference, member.id, electionId, pollingUnitId, cleanText(body.experience, 1200) || null, now, now).run(); }
    catch { return NextResponse.json({ error: "You already have an application for this election." }, { status: 409 }); }
    return NextResponse.json({ ok: true, reference });
  } catch (error) { console.error("polling-agent application failed", error); return NextResponse.json({ error: "The application could not be submitted." }, { status: 500 }); }
}
