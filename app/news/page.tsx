import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { approvedNews } from "@/content/public";
export const metadata: Metadata = { title: "Newsroom", description: "Official APM press releases, announcements and party updates." };
export default function NewsPage() { return <main><section className="page-hero compact"><p className="eyebrow">Newsroom</p><h1>Official updates from APM.</h1><p>Press releases, announcements and verified reports will be published with dates, categories and responsible editorial review.</p></section><section className="editorial-list">{approvedNews.length === 0 && <EmptyState title="Approved stories are being prepared" message="The old website's sample finance articles have been excluded. Verified APM newsroom content will appear here after editorial approval." />}</section></main>; }
