"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <><div className="values-bar" aria-label="APM values"><span>Integrity</span><span>Sacrifice</span><span>Service</span></div><header className="site-header">
    <Link className="brand" href="/" aria-label="APM home"><Image src="/apm-logo.jpg" alt="Allied Peoples' Movement logo" width={58} height={58} priority /><span><strong>APM</strong><small>Allied Peoples' Movement</small></span></Link>
    <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
    <div className="header-actions"><Link className="icon-button search-button" href="/search" aria-label="Search the public website"><Search size={20} /></Link><a className="button button-secondary member-login" href="https://members-register.apm.org.ng/">Member Login</a><a className="button" href="https://members-register.apm.org.ng/">Join APM</a><button className="icon-button menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </header></>;
}
