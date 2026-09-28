import { cookies } from "next/headers";
import { env } from "cloudflare:workers";

export const SESSION_COOKIE = "apm_member_session";
export const ACCESS_CODE_TTL_SECONDS = 10 * 60;

export function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
export function cleanText(value: unknown, max = 120) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
export function makeReference(prefix: "APM" | "AGT") {
  const year = new Date().getUTCFullYear();
  return `${prefix}-${year}-${crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;
}
export function makeCode() { return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0"); }
export function makeToken() { return `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll("-", ""); }
export async function hashSecret(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function getD1() {
  if (!env.DB) throw new Error("Membership services are temporarily unavailable.");
  return env.DB;
}
export async function getCurrentMember() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = await hashSecret(token);
  const row = await getD1().prepare(`SELECT m.* FROM member_sessions s JOIN members m ON m.id = s.member_id WHERE s.token_hash = ? AND s.expires_at > ?`).bind(tokenHash, Date.now()).first<Record<string, unknown>>();
  return row ?? null;
}
export function publicStatus(status: string) {
  return ({ pending_email: "Email verification required", pending_review: "Pending membership review", approved: "Approved member", rejected: "Application not approved", suspended: "Membership suspended" } as Record<string, string>)[status] ?? "Status unavailable";
}

export async function sendAccessEmail(input: { email: string; code: string; purpose: "verify_email" | "sign_in" }) {
  void input.email;
  void input.purpose;
  const runtimeEnv = env as unknown as Record<string, unknown>;
  if (process.env.NODE_ENV !== "production" || runtimeEnv.MEMBERSHIP_DEV_CODES === "true") return { delivered: false, developmentCode: input.code };
  throw new Error("Membership email delivery is awaiting an APM-approved provider and sender domain.");
}
