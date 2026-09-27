import type { Metadata } from "next";
import { ChapterDirectory } from "@/components/chapter-directory";
export const metadata: Metadata = { title: "Find a Chapter", description: "Find verified APM secretariat and chapter contact information." };
export default function ChaptersPage() { return <main><section className="page-hero compact"><p className="eyebrow">Find APM</p><h1>Verified party offices.</h1><p>Only offices with approved public addresses and contact details are included.</p></section><section className="tool-page"><ChapterDirectory /></section></main>; }
