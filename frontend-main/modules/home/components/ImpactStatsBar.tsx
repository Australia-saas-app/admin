import { Award, FileText, Globe2, Medal, TrendingUp, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { value: "150+", label: "Countries Served", icon: Globe2 },
  { value: "12K+", label: "Happy Clients", icon: UserRound },
  { value: "700K+", label: "Projects Delivered", icon: FileText },
  { value: "200M+", label: "Revenue Generated", icon: TrendingUp },
  { value: "15K+", label: "Awards Won", icon: Award },
  { value: "5Y+", label: "Years of Experience", icon: Medal },
];

export default function ImpactStatsBar() {
  return (
    <section className="bg-background py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl bg-[#1A4CD2] px-4 py-5 shadow-[0_8px_28px_rgba(26,76,210,0.28)] sm:px-6 md:rounded-[1.25rem] md:py-6 lg:px-8">
          <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <li
                  key={stat.label}
                  className={`flex items-center gap-2.5 px-2 lg:px-3 ${
                    index > 0 ? "lg:border-l lg:border-white/20" : ""
                  }`}
                >
                  <Icon
                    className="h-7 w-7 shrink-0 text-white sm:h-8 sm:w-8"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <div className="min-w-0 leading-tight">
                    <p className="text-lg font-bold text-white sm:text-xl">{stat.value}</p>
                    <p className="text-[11px] text-white/90 sm:text-xs">{stat.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
