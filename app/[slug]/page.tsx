import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicPage } from "@/components/public-page";
import { publicPages, type PublicPageSlug } from "@/content/site";
export function generateStaticParams() { return Object.keys(publicPages).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; if (!(slug in publicPages)) return {}; const page = publicPages[slug as PublicPageSlug]; return { title: page.eyebrow, description: page.intro }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!(slug in publicPages)) notFound(); return <PublicPage {...publicPages[slug as PublicPageSlug]} />; }
