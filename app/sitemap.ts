import type { MetadataRoute } from "next";
const routes = ["", "/about", "/policies", "/leadership", "/resources", "/news", "/events", "/chapters", "/get-involved", "/contact", "/privacy", "/accessibility", "/search"];
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apm.org.ng"; return routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === "/news" || route === "/events" ? "weekly" : "monthly", priority: route === "" ? 1 : .7 })); }
