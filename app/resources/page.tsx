import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/resource-library";
export const metadata: Metadata = { title: "Resource Centre", description: "Search and access official APM documents and voter-information resources." };
export default function ResourcesPage() { return <main><section className="page-hero compact"><p className="eyebrow">Resource centre</p><h1>Official documents and public information.</h1><p>Find party documents and trusted voter-information links, with publication and version details where confirmed.</p></section><section className="tool-page"><ResourceLibrary /></section></main>; }
