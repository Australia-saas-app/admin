import Link from "next/link";
import { ArrowRight, Check, Compass, Grid3x3, Megaphone, Play, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Business {
  name: string;
  category: string;
  rating: string;
  reviews: number;
  location: string;
  verified?: boolean;
  href: string;
  logo: {
    letter?: string;
    icon?: LucideIcon;
    bg: string;
    text?: string;
  };
}

const BUSINESSES: Business[] = [
  {
    name: "PixelCraft Studio",
    category: "Web Development",
    rating: "4.9",
    reviews: 230,
    location: "USA",
    verified: true,
    href: "/associate",
    logo: { letter: "P", bg: "bg-[#111827]", text: "text-white" },
  },
  {
    name: "TechBase Solutions",
    category: "Software & IT Services",
    rating: "4.8",
    reviews: 180,
    location: "UK",
    href: "/associate",
    logo: { icon: Grid3x3, bg: "bg-[#2563EB]", text: "text-white" },
  },
  {
    name: "DesignHub Pro",
    category: "Graphics & Design",
    rating: "4.9",
    reviews: 210,
    location: "Canada",
    verified: true,
    href: "/associate",
    logo: { letter: "D", bg: "bg-[#E11D48]", text: "text-white" },
  },
  {
    name: "Marketing Genie",
    category: "Digital Marketing",
    rating: "4.8",
    reviews: 190,
    location: "Australia",
    href: "/associate",
    logo: { icon: Megaphone, bg: "bg-[#0D9488]", text: "text-white" },
  },
  {
    name: "DevOps Experts",
    category: "Cloud & DevOps",
    rating: "4.9",
    reviews: 160,
    location: "Germany",
    href: "/associate",
    logo: { icon: Compass, bg: "bg-[#111827]", text: "text-white" },
  },
  {
    name: "Creative Minds",
    category: "Video & Animation",
    rating: "4.8",
    reviews: 140,
    location: "India",
    href: "/associate",
    logo: { icon: Play, bg: "bg-[#2563EB]", text: "text-white" },
  },
];

export default function FeaturedBusinesses() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative mb-6 text-center md:mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
            Featured Businesses
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Verified businesses providing top quality services
          </p>
          <Link
            href="/associate"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] md:absolute md:right-0 md:top-1/2 md:mt-0 md:-translate-y-1/2"
          >
            View All Businesses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {BUSINESSES.map((biz) => (
            <BusinessCard key={biz.name} business={biz} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessCard({ business }: { business: Business }) {
  const Icon = business.logo.icon;

  return (
    <Link
      href={business.href}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 transition hover:border-border hover:shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
    >
      <span
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${business.logo.bg} ${business.logo.text ?? "text-white"}`}
      >
        {Icon ? <Icon className="h-5 w-5" strokeWidth={2} aria-hidden /> : business.logo.letter}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <h3 className="truncate text-sm font-bold text-foreground">{business.name}</h3>
          {business.verified && (
            <span
              className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#2563EB]"
              aria-label="Verified"
            >
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} aria-hidden />
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{business.category}</p>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" aria-hidden />
          <span className="font-semibold text-foreground">{business.rating}</span>
          <span className="text-muted-foreground">({business.reviews})</span>
          <span className="text-border">•</span>
          <span>{business.location}</span>
        </p>
      </div>
    </Link>
  );
}
