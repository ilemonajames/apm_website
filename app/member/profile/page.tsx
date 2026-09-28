import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/membership-forms";
import { getCurrentMember } from "@/lib/member-auth";
export const dynamic = "force-dynamic";
export default async function ProfilePage() { const member = await getCurrentMember(); if (!member) redirect("/membership/login"); return <main className="form-page"><section><p className="eyebrow">Member profile</p><h1>Update your contact details.</h1><p>Your name and verified email require an authorised correction request.</p><ProfileForm member={member} /></section></main>; }
