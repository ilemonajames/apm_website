import { redirect } from "next/navigation";
import { MembershipCard } from "@/components/membership-card";
import { getCurrentMember } from "@/lib/member-auth";
export const dynamic = "force-dynamic";
export default async function MemberCardPage(){const member=await getCurrentMember();if(!member)redirect("/membership/login");return <main className="form-page"><section><p className="eyebrow">Member services</p><h1>Your APM membership card.</h1><p>Review your details and download a digital copy.</p><MembershipCard member={{name:[member.first_name,member.middle_name,member.last_name].filter(Boolean).join(" "),reference:String(member.membership_reference),state:String(member.state_code??""),ward:String(member.ward_name??""),hasPhoto:Boolean(member.photo_path)}}/></section></main>}
