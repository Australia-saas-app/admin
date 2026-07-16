"use client";

import Image from "next/image";
import {
  Rocket,
  ShieldCheck,
  BarChart2,
  Globe,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: <Rocket className="w-5 h-5 text-blue-600" />, label: "Smart", sub: "Solutions" },
  { icon: <ShieldCheck className="w-5 h-5 text-blue-600" />, label: "Secure &", sub: "Reliable" },
  { icon: <BarChart2 className="w-5 h-5 text-blue-600" />, label: "Scalable", sub: "Growth" },
  { icon: <Globe className="w-5 h-5 text-blue-600" />, label: "Global", sub: "Impact" },
];

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="w-full bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-64px)] gap-8 lg:gap-0">

          {/* ─── Left Content ─── */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center py-10 lg:py-16 order-2 lg:order-1">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
              Accelerating Business
              <br />
              Growth Through{" "}
              <span className="text-blue-600">Innovation</span>
              <br />
              <span className="text-blue-600">And Technology</span>
            </h1>

            {/* Sub-text */}
            <p className="text-slate-500 text-base leading-relaxed max-w-md mb-8">
              We help businesses build powerful digital experiences through smart
              technology, modern infrastructure, and scalable solutions designed
              for a fast-moving global economy.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mb-10">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <div className="shrink-0 p-1.5 bg-blue-50 rounded-lg">
                    {f.icon}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 leading-tight">
                    {f.label}
                    <br />
                    {f.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-95"
              >
                Get Started
                <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <button className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-full border border-slate-200 shadow-sm transition-all duration-200 active:scale-95">
                Explore Services
                <span className="flex items-center justify-center w-7 h-7 border border-slate-300 rounded-full group-hover:border-blue-400 transition-colors">
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </span>
              </button>
            </div>
          </div>

          {/* ─── Right: Hero Image ─── */}
          <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2 pt-8 lg:pt-0">
            <div className="relative w-full max-w-xl lg:max-w-none">
              <Image
                src="/heroImage.png"
                alt="Business professionals using technology"
                width={700}
                height={580}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* ─── "Choose Your Account Type" teaser ─── */}
      <div className="border-t border-slate-100 bg-white py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
          Choose Your Account Type
        </h2>
        <p className="text-slate-500 text-sm">
          Join as per your goals and unlock the right opportunities
        </p>
      </div>
    </section>
  );
}
