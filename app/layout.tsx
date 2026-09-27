import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://apm.org.ng"),
  title: { default: "Allied Peoples' Movement | Nigeria First", template: "%s | APM" },
  description: "Official information, policies, leadership and membership resources from the Allied Peoples' Movement.",
  openGraph: { title: "Allied Peoples' Movement", description: "Nigeria First. Public information, policies, leadership and membership resources.", type: "website" },
  icons: {
    icon: "/apm-logo.jpg",
    shortcut: "/apm-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
