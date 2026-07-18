import Link from "next/link";
import { Globe2, Leaf, Lightbulb, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ValueCard {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

const VALUES: ValueCard[] = [
  {
    title: "Innovation",
    description: "Driving the future with smart ideas",
    icon: Lightbulb,
    iconColor: "text-[#38BDF8]",
  },
  {
    title: "Sustainability",
    description: "Building a greener digital world",
    icon: Leaf,
    iconColor: "text-[#4ADE80]",
  },
  {
    title: "Global Reach",
    description: "Serving clients in 150+ countries",
    icon: Globe2,
    iconColor: "text-[#C084FC]",
  },
];

export default function GlobalCommitment() {
  return (
    <section className="relative overflow-hidden bg-[#050A1B] py-14 md:py-16">
      {/* City skyline glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.28)_0%,rgba(168,85,247,0.18)_35%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 10px, rgba(96,165,250,0.15) 10px 12px), repeating-linear-gradient(90deg, transparent 0 22px, rgba(244,114,182,0.12) 22px 24px)",
          maskImage: "linear-gradient(to top, black 20%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 95%)",
        }}
      />
      {/* Building silhouettes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center gap-1 opacity-40 sm:h-28"
      >
        {[40, 70, 55, 90, 48, 78, 62, 95, 50, 72, 58, 85, 45, 68].map((h, i) => (
          <span
            key={i}
            className="w-3 rounded-t-sm bg-gradient-to-t from-[#0EA5E9]/40 via-[#6366F1]/25 to-transparent sm:w-4"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
            <span className="block text-[#3B82F6]">A Global Company</span>
            <span className="block text-white">With Local Commitment</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-[15px]">
            We are committed to building intelligent solutions that empower businesses and create a
            better digital world for everyone.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/our-teams"
              className="inline-flex h-11 items-center rounded-full bg-[#2563EB] px-6 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              About Us
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2.5 text-sm font-medium text-white transition hover:text-white/90"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B82F6] text-[#3B82F6]">
                <Play className="h-4 w-4 fill-current" aria-hidden />
              </span>
              Watch Video
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-6 text-center shadow-[0_0_24px_rgba(59,130,246,0.08)]"
              >
                <Icon
                  className={`mx-auto h-8 w-8 ${value.iconColor}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="mt-3 text-base font-bold text-white">{value.title}</h3>
                <p className="mt-1.5 text-xs leading-snug text-white/65">{value.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
