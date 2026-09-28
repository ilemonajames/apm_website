import type { Metadata } from "next";
import { LoginForm } from "@/components/membership-forms";
export const metadata: Metadata = { title: "Member login" };
export default function LoginPage() { return <main className="form-page"><section><p className="eyebrow">Member access</p><h1>Welcome back.</h1><LoginForm /></section></main>; }
