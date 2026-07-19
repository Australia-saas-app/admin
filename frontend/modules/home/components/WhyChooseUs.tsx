import { ShieldCheck, Lock, Headphones, Globe2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Card background */
  bg: string;
  /** Icon circle background */
  iconBg: string;
  /** Icon color */
  iconColor: string;
}

const features: Feature[] = [
  {
    title: "Verified Professionals",
    description: "All professionals are verified and trusted.",
    icon: ShieldCheck,
    bg: "bg-[#EEF5FF] dark:bg-blue-950/40",
    iconBg: "bg-[#D6E8FF] dark:bg-blue-900/50",
    iconColor: "text-[#2B7DE9]",
  },
  {
    title: "Secure Payments",
    description: "Your payments are safe with us.",
    icon: Lock,
    bg: "bg-[#FFF6E8] dark:bg-amber-950/40",
    iconBg: "bg-[#FFE8C2] dark:bg-amber-900/50",
    iconColor: "text-[#E8A317]",
  },
  {
    title: "24/7 Support",
    description: "We're here to help you anytime.",
    icon: Headphones,
    bg: "bg-[#EEFBF3] dark:bg-green-950/40",
    iconBg: "bg-[#D4F5E2] dark:bg-green-900/50",
    iconColor: "text-[#22A35A]",
  },
  {
    title: "Global Reach",
    description: "Connect with talent from 120+ countries.",
    icon: Globe2,
    bg: "bg-[#F0F0FF] dark:bg-indigo-950/40",
    iconBg: "bg-[#DDDDF8] dark:bg-indigo-900/50",
    iconColor: "text-[#4B5FD4]",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="reveal-scroll mb-8 text-center text-2xl font-bold tracking-tight text-foreground md:mb-10 md:text-[1.75rem] lg:text-[2rem]">
          Why Choose MultiService?
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={`reveal-scroll flex items-center gap-3.5 rounded-2xl px-4 py-4 md:gap-4 md:px-5 md:py-5 ${feature.bg}`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full md:h-[52px] md:w-[52px] ${feature.iconBg}`}
                >
                  <Icon
                    className={`h-6 w-6 md:h-[26px] md:w-[26px] ${feature.iconColor}`}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold leading-snug text-foreground md:text-[15px]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-snug text-muted-foreground md:text-[13px]">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
