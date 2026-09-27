import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { approvedEvents } from "@/content/public";
export const metadata: Metadata = { title: "Events", description: "Approved Allied Peoples' Movement public events." };
export default function EventsPage() { return <main><section className="page-hero compact"><p className="eyebrow">Events</p><h1>Meet, organise and participate.</h1><p>Approved public events will include confirmed dates, locations, organisers and participation details.</p></section><section className="editorial-list">{approvedEvents.length === 0 && <EmptyState title="No approved public events listed" message="Events will be published here after the date, venue and responsible party office have been verified." />}</section></main>; }
