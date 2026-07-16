"use client";

import { useRouter } from "next/navigation";
import { AuthFlipContainer } from "@/core/auth/ui/AuthFlipContainer";
import { Navbar } from "@/core/landing/ui/Navbar";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Shared Navbar — logo goes back to landing, no Sign up button on login */}
      <Navbar onGetStarted={() => router.push("/login")} showGetStarted={false} />

      {/* Login content */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 py-10">

        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-200 opacity-20 rounded-full blur-3xl" />
        </div>

        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

          {/* Left Side: Copy & Branding */}
          <div className="w-full lg:w-[460px] flex-shrink-0 text-center lg:text-left space-y-5">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 text-sm font-semibold mb-2">
              Unified Global Platform
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              One account. <br className="hidden lg:block" />
              <span className="text-blue-600">Endless</span> possibilities.
            </h1>
            <p className="text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to the ultimate super app. Whether you&apos;re booking a ride,
              offering a service, or managing a business, it all happens right here.
            </p>

            {/* Stat Cards */}
            <div className="hidden lg:grid grid-cols-3 gap-3 pt-4 w-full max-w-sm">
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-blue-600 mb-1">10k+</h4>
                <p className="text-sm text-slate-500 font-medium">Verified Businesses</p>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-blue-600 mb-1">$2M+</h4>
                <p className="text-sm text-slate-500 font-medium">Escrow Payments</p>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-blue-600 mb-1">4.9/5</h4>
                <p className="text-sm text-slate-500 font-medium">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Side: Auth Forms */}
          <div className="w-full lg:w-[400px] flex-shrink-0 flex justify-center">
            <AuthFlipContainer />
          </div>

        </div>
      </main>
    </div>
  );
}
