import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";

const BENEFITS = ["High Commission", "Real-time Tracking", "Instant Withdraw", "Marketing Support"];

const STATS = [
  { label: "Clicks", value: "12,540" },
  { label: "Referrals", value: "1,250" },
  { label: "Conversion", value: "35.5%" },
];

/** Sharp line chart — no glow/blur fills */
function EarningsChart() {
  const points = [
    [8, 72],
    [22, 58],
    [36, 62],
    [50, 40],
    [64, 48],
    [78, 28],
    [92, 34],
  ] as const;

  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg
      viewBox="0 0 100 90"
      className="mt-4 h-[120px] w-full md:h-[140px]"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polyline}
        vectorEffect="non-scaling-stroke"
      />
      {points.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="2.2"
          fill="#3B82F6"
          stroke="#0B1B3A"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export default function AffiliateEarnings() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:gap-10 md:px-6 lg:grid-cols-[0.95fr_1.15fr] lg:gap-12">
        {/* Left */}
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2563EB]">
            Affiliate &amp; Earning Opportunities
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-[1.9rem] lg:text-[2.15rem]">
            Earn More With Our Smart Affiliate System
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Join our affiliate program and start earning by referring businesses and customers.
          </p>

          <ul className="mt-5 space-y-2.5">
            {BENEFITS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm font-medium text-foreground"
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/account/affiliate/registration"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Become an Affiliate
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Right dashboard */}
        <div className="w-full">
          <div className="rounded-2xl bg-[#0B1B3A] px-5 py-5 text-white md:px-6 md:py-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white/80">Your Earnings</p>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-white/25 px-2.5 py-1 text-[11px] font-medium text-white/90"
              >
                This Month
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-3xl font-bold tracking-tight md:text-4xl">$5,620.00</p>
              <p className="mb-1 text-sm font-semibold text-[#4ADE80]">+ 15.7%</p>
            </div>

            <EarningsChart />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card px-3 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)] md:px-4 md:py-4"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#93C5FD]" aria-hidden />
                  <p className="text-[11px] font-medium text-muted-foreground md:text-xs">
                    {stat.label}
                  </p>
                </div>
                <p className="mt-1.5 text-base font-bold text-[#1D4ED8] md:text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
