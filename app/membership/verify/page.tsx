import type { Metadata } from "next";
import { VerificationForm } from "@/components/membership-forms";
export const metadata: Metadata = { title: "Verify membership email" };
export default function VerifyPage() { return <main className="form-page"><section><p className="eyebrow">Membership</p><h1>Verify your email.</h1><p>Verification confirms email ownership. It does not by itself mean party membership has been approved.</p><VerificationForm /></section></main>; }
