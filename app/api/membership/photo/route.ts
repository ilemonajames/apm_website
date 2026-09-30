import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentMember, getD1 } from "@/lib/member-auth";

const allowed = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);
export async function GET() {
  const member = await getCurrentMember();
  if (!member?.photo_path) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  try { const file = await readFile(String(member.photo_path)), extension = path.extname(String(member.photo_path)).slice(1); return new NextResponse(file, { headers: { "Content-Type": extension === "jpg" ? "image/jpeg" : `image/${extension}`, "Cache-Control": "private, max-age=300" } }); }
  catch { return NextResponse.json({ error: "Photo not found." }, { status: 404 }); }
}
export async function POST(request: Request) {
  const member = await getCurrentMember(); if (!member) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const photo = (await request.formData()).get("photo");
  if (!(photo instanceof File) || !allowed.has(photo.type)) return NextResponse.json({ error: "Choose a JPG, PNG or WebP image." }, { status: 400 });
  if (photo.size > 3 * 1024 * 1024) return NextResponse.json({ error: "Photo must be 3 MB or smaller." }, { status: 400 });
  const directory = process.env.APM_UPLOAD_DIR ?? "/tmp/apm-uploads"; await mkdir(directory, { recursive: true });
  const destination = path.join(directory, `${member.id}.${allowed.get(photo.type)}`); await writeFile(destination, new Uint8Array(await photo.arrayBuffer()));
  await getD1().prepare("UPDATE members SET photo_path = ?, updated_at = ? WHERE id = ?").bind(destination, Date.now(), member.id).run();
  return NextResponse.json({ ok: true });
}
