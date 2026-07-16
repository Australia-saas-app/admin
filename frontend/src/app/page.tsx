"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/core/landing/ui/Navbar";
import { LandingPage } from "@/core/landing/ui/LandingPage";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleSignUp = (role?: string | any) => {
    const roleString = typeof role === 'string' ? role : undefined;
    const roleParam = roleString ? `&role=${roleString}` : "";
    router.push(`/login?mode=register${roleParam}`);
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] pt-16">
      <Navbar onSignUp={handleSignUp} />
      <LandingPage onGetStarted={handleGetStarted} onSignUp={handleSignUp} />
    </div>
  );
}
