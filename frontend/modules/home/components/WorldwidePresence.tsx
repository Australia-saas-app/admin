"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

type Region =
  | "All Regions"
  | "North America"
  | "South America"
  | "Europe"
  | "Asia Pacific"
  | "Middle East"
  | "Africa";

interface Country {
  name: string;
  code: string;
  region: Exclude<Region, "All Regions">;
}

const REGIONS: Region[] = [
  "All Regions",
  "North America",
  "South America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Africa",
];

const COUNTRIES: Country[] = [
  { name: "USA", code: "us", region: "North America" },
  { name: "Canada", code: "ca", region: "North America" },
  { name: "Mexico", code: "mx", region: "North America" },
  { name: "Brazil", code: "br", region: "South America" },
  { name: "Argentina", code: "ar", region: "South America" },
  { name: "United Kingdom", code: "gb", region: "Europe" },
  { name: "Germany", code: "de", region: "Europe" },
  { name: "France", code: "fr", region: "Europe" },
  { name: "Netherlands", code: "nl", region: "Europe" },
  { name: "Spain", code: "es", region: "Europe" },
  { name: "UAE", code: "ae", region: "Middle East" },
  { name: "Saudi Arabia", code: "sa", region: "Middle East" },
  { name: "Qatar", code: "qa", region: "Middle East" },
  { name: "Kuwait", code: "kw", region: "Middle East" },
  { name: "Bahrain", code: "bh", region: "Middle East" },
  { name: "India", code: "in", region: "Asia Pacific" },
  { name: "China", code: "cn", region: "Asia Pacific" },
  { name: "Japan", code: "jp", region: "Asia Pacific" },
  { name: "Singapore", code: "sg", region: "Asia Pacific" },
  { name: "Malaysia", code: "my", region: "Asia Pacific" },
  { name: "Australia", code: "au", region: "Asia Pacific" },
  { name: "New Zealand", code: "nz", region: "Asia Pacific" },
  { name: "South Africa", code: "za", region: "Africa" },
  { name: "Nigeria", code: "ng", region: "Africa" },
  { name: "Egypt", code: "eg", region: "Africa" },
];

/** Row-major order matching the design (5 columns × 5 rows). */
const DISPLAY_ORDER = [
  "USA",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "India",
  "China",
  "Japan",
  "Singapore",
  "Malaysia",
  "Australia",
  "New Zealand",
  "South Africa",
  "Nigeria",
  "Egypt",
];

const CHECKLIST = [
  "Local teams, global standards",
  "On-time delivery across all regions",
  "24/7 support in your time zone",
  "Cultural understanding & market insight",
];

export default function WorldwidePresence() {
  const [activeRegion, setActiveRegion] = useState<Region>("All Regions");

  const countries = useMemo(() => {
    const filtered =
      activeRegion === "All Regions"
        ? COUNTRIES
        : COUNTRIES.filter((c) => c.region === activeRegion);

    return [...filtered].sort(
      (a, b) => DISPLAY_ORDER.indexOf(a.name) - DISPLAY_ORDER.indexOf(b.name)
    );
  }, [activeRegion]);

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:gap-10 md:px-6 lg:grid-cols-[0.9fr_1.35fr] lg:gap-12">
        {/* Left copy */}
        <div className="reveal-scroll max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB]">
            Worldwide Presence
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-[1.85rem] lg:text-[2.1rem]">
            Delivering Solutions Across The Globe
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            We combine global expertise with local understanding to help businesses grow, innovate,
            and succeed in today&apos;s digital world.
          </p>

          <ul className="mt-5 space-y-2.5">
            {CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm font-medium text-foreground"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right regions card */}
        <div className="reveal-scroll rounded-2xl border border-border bg-card p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-6">
          <div
            className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter by region"
          >
            {REGIONS.map((region) => {
              const active = region === activeRegion;
              return (
                <button
                  key={region}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveRegion(region)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors whitespace-nowrap md:text-[13px] ${
                    active
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>

          <div className="mt-5 divide-y divide-border">
            {Array.from({ length: Math.ceil(countries.length / 5) }, (_, rowIndex) => {
              const row = countries.slice(rowIndex * 5, rowIndex * 5 + 5);
              return (
                <div
                  key={rowIndex}
                  className="grid grid-cols-2 gap-x-3 py-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {row.map((country) => (
                    <div key={country.code} className="flex min-w-0 items-center gap-2">
                      <Image
                        src={`https://flagcdn.com/w40/${country.code}.png`}
                        alt=""
                        width={22}
                        height={16}
                        className="h-3.5 w-auto shrink-0 rounded-[2px] object-cover shadow-sm"
                      />
                      <span className="truncate text-[12px] font-medium text-foreground md:text-[13px]">
                        {country.name}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">… and many more</p>
        </div>
      </div>
    </section>
  );
}
