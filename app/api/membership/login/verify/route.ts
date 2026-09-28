import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getD1, hashSecret, makeToken, normalizeEmail, SESSION_COOKIE } from "@/lib/member-auth";
export async function POST(request: Request) {
  try {
    const { email: rawEmail, code } = await request.json() as { email?: string; code?: string }, email = normalizeEmail(rawEmail ?? ""), now = Date.now(), db = getD1();
    const row = await db.prepare(`SELECT c.id code_id, c.member_id, c.attempt_count FROM member_access_codes c JOIN members m ON m.id = c.member_id WHERE m.email = ? AND c.purpose = 'sign_in' AND c.used_at IS NULL ORDER BY c.created_at DESC LIMIT 1`).bind(email).first<{ code_id: string; member_id: string; attempt_count: number }>();
    if (!row || row.attempt_count >= 5) return NextResponse.json({ error: "This code is invalid or has expired." }, { status: 400 });
    const matched = await db.prepare("SELECT id FROM member_access_codes WHERE id = ? AND code_hash = ? AND expires_at > ?").bind(row.code_id, await hashSecret((code ?? "").trim()), now).first();
    if (!matched) { await db.prepare("UPDATE member_access_codes SET attempt_count = attempt_count + 1 WHERE id = ?").bind(row.code_id).run(); return NextResponse.json({ error: "This code is invalid or has expired." }, { status: 400 }); }
    const token = makeToken(), expires = now + 30 * 24 * 60 * 60 * 1000;
    await db.batch([db.prepare("UPDATE member_access_codes SET used_at = ? WHERE id = ?").bind(now, row.code_id), db.prepare("INSERT INTO member_sessions (id, member_id, token_hash, expires_at, created_at, last_used_at) VALUES (?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), row.member_id, await hashSecret(token), expires, now, now)]);
    (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(expires) }); return NextResponse.json({ ok: true });
  } catch (error) { console.error("login verification failed", error); return NextResponse.json({ error: "Member access is temporarily unavailable." }, { status: 500 }); }
}
