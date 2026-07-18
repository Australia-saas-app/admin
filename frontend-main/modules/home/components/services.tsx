import Link from "next/link";
import type { ComponentType } from "react";
import ImageIcons from "@/src/components/ui/ImageIcons";
import { SERVICE_ROUTES } from "@/src/shared/constants/site-routes";

type ServiceIcon = ComponentType<{ size?: number; className?: string; alt?: string }>;

interface ServiceItem {
  name: string;
  description: string;
  icon: ServiceIcon;
  /** Soft circular glow + accent divider color */
  accent: string;
  glow: string;
}

const services: ServiceItem[] = [
  {
    name: "Technology",
    description: "Innovative tech solutions designed to solve modern challenges.",
    icon: ImageIcons.IconTechnicalImg,
    accent: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.14)",
  },
  {
    name: "Construction",
    description: "Building tomorrow with quality, safety, and sustainability.",
    icon: ImageIcons.IconConstructionImg,
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.16)",
  },
  {
    name: "Real Estate",
    description: "Find, buy, or rent properties with ease and confidence.",
    icon: ImageIcons.IconRealEstateImg,
    accent: "#22C55E",
    glow: "rgba(34, 197, 94, 0.14)",
  },
  {
    name: "Commercial & Industrial",
    description: "End-to-end solutions for commercial and industrial needs.",
    icon: ImageIcons.IconCommercialIndustrialImg,
    accent: "#2563EB",
    glow: "rgba(37, 99, 235, 0.14)",
  },
  {
    name: "Visa & Travel",
    description: "Visa assistance and travel services for a seamless journey.",
    icon: ImageIcons.IconVisaTravelImg,
    accent: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.14)",
  },
  {
    name: "Education",
    description: "Empowering learners through quality education and courses.",
    icon: ImageIcons.IconEducationImg,
    accent: "#EC4899",
    glow: "rgba(236, 72, 153, 0.14)",
  },
  {
    name: "Careers",
    description: "Find the right opportunity and build your dream career.",
    icon: ImageIcons.IconCareersImg,
    accent: "#14B8A6",
    glow: "rgba(20, 184, 166, 0.14)",
  },
  {
    name: "Healthcare",
    description: "Quality healthcare services you can trust for a better life.",
    icon: ImageIcons.IconHealthcareImg,
    accent: "#EF4444",
    glow: "rgba(239, 68, 68, 0.14)",
  },
  {
    name: "Market Place",
    description: "A wide range of products and services in one trusted marketplace.",
    icon: ImageIcons.IconMarketPlaceImg,
    accent: "#A855F7",
    glow: "rgba(168, 85, 247, 0.14)",
  },
  {
    name: "Business",
    description: "Business solutions to help you grow and succeed globally.",
    icon: ImageIcons.IconBusinessImg,
    accent: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.14)",
  },
  {
    name: "Investment",
    description: "Smart investment opportunities for a secure future.",
    icon: ImageIcons.IconInvestmentImg,
    accent: "#16A34A",
    glow: "rgba(22, 163, 74, 0.14)",
  },
  {
    name: "Donations",
    description: "Support meaningful causes and make a positive impact.",
    icon: ImageIcons.IconDonationsImg,
    accent: "#F472B6",
    glow: "rgba(244, 114, 182, 0.16)",
  },
];

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="flex items-center gap-1 text-[#3B82F6]/70" aria-hidden>
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
      </span>
      <span className="h-px w-8 bg-[#3B82F6]/45 sm:w-12" aria-hidden />
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3B82F6]">
        {label}
      </span>
      <span className="h-px w-8 bg-[#3B82F6]/45 sm:w-12" aria-hidden />
      <span className="flex items-center gap-1 text-[#3B82F6]/70" aria-hidden>
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
      </span>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-muted/40 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="reveal-scroll mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <SectionEyebrow label="Our Services" />
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground md:text-[2rem] md:leading-tight lg:text-[2.25rem]">
            Our department&apos;s services are provided worldwide.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            With years of experience in mobile security and spyware detection, our products have
            helped countless people safeguard their devices and find peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-6">
          {services.map((service) => {
            const Icon = service.icon;
            const href = SERVICE_ROUTES[service.name] ?? "/";
            return (
              <Link
                key={service.name}
                href={href}
                className="reveal-scroll group flex flex-col items-center rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] md:px-5 md:py-7"
              >
                <div
                  className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: service.glow }}
                >
                  <Icon size={40} className="object-contain" />
                </div>

                <h3 className="text-[13px] font-bold leading-snug text-foreground md:text-sm">
                  {service.name}
                </h3>

                <span
                  className="mt-2.5 mb-2.5 h-0.5 w-5 rounded-full"
                  style={{ backgroundColor: service.accent }}
                  aria-hidden
                />

                <p className="text-[11px] leading-relaxed text-muted-foreground md:text-xs">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
