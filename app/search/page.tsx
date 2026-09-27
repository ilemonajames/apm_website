import type { Metadata } from "next";
import { SearchExperience } from "@/components/search-experience";
export const metadata: Metadata = { title: "Search", description: "Search public APM pages, policies, leaders and official resources." };
export default function SearchPage() { return <main><section className="page-hero compact"><p className="eyebrow">Search</p><h1>Find public APM information.</h1><p>Search approved public pages and official resources. Member records are never included.</p></section><section className="tool-page"><SearchExperience /></section></main>; }
