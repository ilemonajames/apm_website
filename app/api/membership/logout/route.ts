import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getD1, hashSecret, SESSION_COOKIE } from "@/lib/member-auth";
export async function POST() { const jar = await cookies(), token = jar.get(SESSION_COOKIE)?.value; if (token) await getD1().prepare("DELETE FROM member_sessions WHERE token_hash = ?").bind(await hashSecret(token)).run(); jar.delete(SESSION_COOKIE); return NextResponse.json({ ok: true }); }
