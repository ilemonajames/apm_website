import { NextResponse } from "next/server";
import { ACCESS_CODE_TTL_SECONDS, cleanText, getD1, hashSecret, makeCode, makeReference, normalizeEmail, sendAccessEmail } from "@/lib/member-auth";
export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>, email = normalizeEmail(cleanText(body.email, 254));
    const firstName = cleanText(body.firstName, 80), lastName = cleanText(body.lastName, 80), phone = cleanText(body.phone, 30);
    if (!email.includes("@") || !firstName || !lastName || phone.length < 7 || ![true, "true", "on"].includes(body.consent as never)) return NextResponse.json({ error: "Complete all required fields and accept the privacy notice." }, { status: 400 });
    const db = getD1(), existing = await db.prepare("SELECT id, status FROM members WHERE email = ?").bind(email).first<{ id: string; status: string }>();
    if (existing && existing.status !== "pending_email") return NextResponse.json({ error: "An account already uses this email. Use member sign in instead." }, { status: 409 });
    const memberId = existing?.id ?? crypto.randomUUID(), now = Date.now(), code = makeCode();
    if (!existing) await db.prepare(`INSERT INTO members (id, membership_reference, email, first_name, middle_name, last_name, phone, state_code, lga_name, ward_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_email', ?, ?)`).bind(memberId, makeReference("APM"), email, firstName, cleanText(body.middleName, 80) || null, lastName, phone, cleanText(body.state, 40) || null, cleanText(body.lga, 100) || null, cleanText(body.ward, 100) || null, now, now).run();
    await db.prepare("UPDATE member_access_codes SET used_at = ? WHERE member_id = ? AND purpose = 'verify_email' AND used_at IS NULL").bind(now, memberId).run();
    await db.prepare("INSERT INTO member_access_codes (id, member_id, purpose, code_hash, expires_at, attempt_count, created_at) VALUES (?, ?, 'verify_email', ?, ?, 0, ?)").bind(crypto.randomUUID(), memberId, await hashSecret(code), now + ACCESS_CODE_TTL_SECONDS * 1000, now).run();
    const delivery = await sendAccessEmail({ email, code, purpose: "verify_email" }); return NextResponse.json({ ok: true, email, developmentCode: delivery.developmentCode });
  } catch (error) { console.error("membership registration failed", error); return NextResponse.json({ error: error instanceof Error ? error.message : "Registration is temporarily unavailable." }, { status: 500 }); }
}
