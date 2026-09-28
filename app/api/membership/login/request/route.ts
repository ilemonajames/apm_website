import { NextResponse } from "next/server";
import { ACCESS_CODE_TTL_SECONDS, getD1, hashSecret, makeCode, normalizeEmail, sendAccessEmail } from "@/lib/member-auth";
export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json() as { email?: string }, email = normalizeEmail(rawEmail ?? ""), db = getD1();
    const member = await db.prepare("SELECT id FROM members WHERE email = ? AND email_verified_at IS NOT NULL").bind(email).first<{ id: string }>();
    if (!member) return NextResponse.json({ ok: true });
    const now = Date.now(), code = makeCode(); await db.prepare("UPDATE member_access_codes SET used_at = ? WHERE member_id = ? AND purpose = 'sign_in' AND used_at IS NULL").bind(now, member.id).run();
    await db.prepare("INSERT INTO member_access_codes (id, member_id, purpose, code_hash, expires_at, attempt_count, created_at) VALUES (?, ?, 'sign_in', ?, ?, 0, ?)").bind(crypto.randomUUID(), member.id, await hashSecret(code), now + ACCESS_CODE_TTL_SECONDS * 1000, now).run();
    const delivery = await sendAccessEmail({ email, code, purpose: "sign_in" }); return NextResponse.json({ ok: true, developmentCode: delivery.developmentCode });
  } catch (error) { console.error("login code request failed", error); return NextResponse.json({ error: error instanceof Error ? error.message : "Member access is temporarily unavailable." }, { status: 500 }); }
}
