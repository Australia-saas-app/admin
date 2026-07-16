"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/core/landing/ui/Navbar";
import { HeroSection } from "@/core/landing/ui/HeroSection";

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      <Navbar onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
    </div>
  );
}
