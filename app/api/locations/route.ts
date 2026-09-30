import { NextResponse } from "next/server";
import locations from "@/content/nigeria-locations.json";

type Named = { id: string; name: { local: string }; lga?: Named[]; ward?: Named[] };
const states = locations.data as Named[];
const present = (entry: Named) => ({ id: entry.id, name: entry.name.local });

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const level = search.get("level") ?? "state";
  const parent = search.get("parent");
  if (level === "state") return NextResponse.json({ items: states.map(present) });
  if (level === "lga" && parent) {
    const state = states.find((entry) => entry.id === parent);
    return NextResponse.json({ items: (state?.lga ?? []).map(present) });
  }
  if (level === "ward" && parent) {
    const lga = states.flatMap((entry) => entry.lga ?? []).find((entry) => entry.id === parent);
    return NextResponse.json({ items: (lga?.ward ?? []).map(present) });
  }
  return NextResponse.json({ items: [] });
}
