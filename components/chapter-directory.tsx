"use client";
import { MapPin } from "lucide-react";
import { chapters } from "@/content/public";
export function ChapterDirectory() { return <div className="directory-list">{chapters.map((chapter) => <article key={chapter.office}><MapPin aria-hidden="true" /><div><span>{chapter.status}</span><h2>{chapter.office}</h2><h3>{chapter.state}</h3><p>{chapter.address}</p><p><strong>Telephone:</strong> {chapter.phone}</p></div></article>)}<div className="directory-notice"><h2>State and LGA directory in verification</h2><p>Additional offices will appear only after their addresses and public contact details are approved by APM.</p></div></div>; }
