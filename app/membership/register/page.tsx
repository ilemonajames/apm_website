import type { Metadata } from "next";
import { RegistrationForm } from "@/components/membership-forms";
export const metadata: Metadata = { title: "Join APM", description: "Start and verify an Allied Peoples' Movement membership application." };
export default function RegisterPage() { return <main className="member-shell"><section className="member-intro"><p className="eyebrow">Membership</p><h1>Join the Allied Peoples&apos; Movement.</h1><p>Create your membership application and verify your email. Party approval is a separate step and will appear in your dashboard.</p><ol><li><strong>1</strong><span>Enter your details</span></li><li><strong>2</strong><span>Verify your email</span></li><li><strong>3</strong><span>Track APM review</span></li></ol></section><RegistrationForm /></main>; }
