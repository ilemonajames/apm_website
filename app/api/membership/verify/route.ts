import { NextResponse } from "next/server";
import { getD1, hashSecret, normalizeEmail } from "@/lib/member-auth";
export async function POST(request: Request) {
  try {
    const { email: rawEmail, code } = await request.json() as { email?: string; code?: string }, email = normalizeEmail(rawEmail ?? ""), now = Date.now(), db = getD1();
    const row = await db.prepare(`SELECT c.id code_id, c.member_id, c.attempt_count, m.membership_reference FROM member_access_codes c JOIN members m ON m.id = c.member_id WHERE m.email = ? AND c.purpose = 'verify_email' AND c.used_at IS NULL ORDER BY c.created_at DESC LIMIT 1`).bind(email).first<{ code_id: string; member_id: string; attempt_count: number; membership_reference: string }>();
    if (!row || row.attempt_count >= 5) return NextResponse.json({ error: "This code is invalid or has expired. Request a new code." }, { status: 400 });
    const matched = await db.prepare("SELECT id FROM member_access_codes WHERE id = ? AND code_hash = ? AND expires_at > ?").bind(row.code_id, await hashSecret((code ?? "").trim()), now).first();
    if (!matched) { await db.prepare("UPDATE member_access_codes SET attempt_count = attempt_count + 1 WHERE id = ?").bind(row.code_id).run(); return NextResponse.json({ error: "This code is invalid or has expired." }, { status: 400 }); }
    await db.batch([db.prepare("UPDATE member_access_codes SET used_at = ? WHERE id = ?").bind(now, row.code_id), db.prepare("UPDATE members SET status = 'pending_review', email_verified_at = ?, updated_at = ? WHERE id = ?").bind(now, now, row.member_id), db.prepare("INSERT INTO membership_status_history (id, member_id, from_status, to_status, reason, actor_id, created_at) VALUES (?, ?, 'pending_email', 'pending_review', 'Email ownership verified', ?, ?)").bind(crypto.randomUUID(), row.member_id, row.member_id, now)]);
    return NextResponse.json({ ok: true, reference: row.membership_reference });
  } catch (error) { console.error("membership verification failed", error); return NextResponse.json({ error: "Verification is temporarily unavailable." }, { status: 500 }); }
}
