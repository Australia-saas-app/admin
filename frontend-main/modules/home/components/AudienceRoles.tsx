import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CircleDollarSign,
  FileCheck2,
  Headphones,
  Megaphone,
  Search,
  TrendingUp,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface AccountCard {
  badge: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  art: string;
  steps: Step[];
  theme: {
    card: string;
    border: string;
    badge: string;
    icon: string;
    iconRing: string;
    button: string;
  };
}

const ACCOUNTS: AccountCard[] = [
  {
    badge: "FOR USERS",
    title: "User Account",
    description: "Find services, hire experts, and get things done easily.",
    cta: "Create User Account",
    href: "/account/user/registration",
    art: "/image/roles/account-user-ill.png",
    steps: [
      { title: "Find Services", description: "Discover what you need", icon: Search },
      { title: "Hire Experts", description: "Connect with professionals", icon: UserRound },
      { title: "Secure Payments", description: "Pay safely with escrow", icon: Headphones },
      { title: "Get Work Done", description: "Track & receive quality work", icon: FileCheck2 },
    ],
    theme: {
      card: "bg-[#F3FBF5] dark:bg-green-950/40",
      border: "border-[#D8F0DF] dark:border-green-800/50",
      badge: "bg-[#DCFCE7] text-[#15803D] dark:bg-green-900/50 dark:text-green-300",
      icon: "text-[#16A34A]",
      iconRing: "border-[#86EFAC] dark:border-green-700",
      button: "bg-[#16A34A] hover:bg-[#15803D]",
    },
  },
  {
    badge: "FOR AFFILIATES",
    title: "Affiliate Account",
    description: "Promote services and earn high commissions.",
    cta: "Become an Affiliate",
    href: "/account/affiliate/registration",
    art: "/image/roles/account-affiliate-ill.png",
    steps: [
      { title: "Join Program", description: "Sign up and get your link", icon: UserPlus },
      { title: "Promote", description: "Share your link anywhere", icon: Megaphone },
      {
        title: "Earn Commissions",
        description: "Get paid for every sale or lead",
        icon: CircleDollarSign,
      },
      { title: "Grow Income", description: "Increase earnings unlimitedly", icon: TrendingUp },
    ],
    theme: {
      card: "bg-[#FFF8F0] dark:bg-orange-950/40",
      border: "border-[#FDE7C8] dark:border-orange-800/50",
      badge: "bg-[#FFEDD5] text-[#C2410C] dark:bg-orange-900/50 dark:text-orange-300",
      icon: "text-[#EA580C]",
      iconRing: "border-[#FDBA74] dark:border-orange-700",
      button: "bg-[#F59E0B] hover:bg-[#D97706]",
    },
  },
  {
    badge: "FOR BUSINESSES",
    title: "Business Account",
    description: "Build your brand, list services, and grow your business.",
    cta: "Create Business Account",
    href: "/account/business/registration",
    art: "/image/roles/account-business-ill.png",
    steps: [
      {
        title: "Business Profile",
        description: "Create your verified business profile",
        icon: Building2,
      },
      { title: "List Services", description: "Add & showcase your services", icon: Briefcase },
      { title: "Manage Team", description: "Add team & assign roles", icon: Users },
      { title: "Analytics", description: "Track performance & grow", icon: BarChart3 },
    ],
    theme: {
      card: "bg-[#F3F7FF] dark:bg-blue-950/40",
      border: "border-[#D6E4FF] dark:border-blue-800/50",
      badge: "bg-[#DBEAFE] text-[#1D4ED8] dark:bg-blue-900/50 dark:text-blue-300",
      icon: "text-[#2563EB]",
      iconRing: "border-[#93C5FD] dark:border-blue-700",
      button: "bg-[#2563EB] hover:bg-[#1D4ED8]",
    },
  },
];

export default function AudienceRoles() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 md:gap-5 md:px-6 lg:grid-cols-3">
        {ACCOUNTS.map((account) => (
          <article
            key={account.title}
            className={`flex flex-col rounded-2xl border ${account.theme.border} ${account.theme.card} p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] md:p-6`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="relative h-[72px] w-[88px] shrink-0 sm:h-[80px] sm:w-[100px]">
                <Image
                  src={account.art}
                  alt=""
                  fill
                  sizes="100px"
                  className="object-contain object-left"
                />
              </div>
              <span
                className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${account.theme.badge}`}
              >
                {account.badge}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground md:text-[1.35rem]">
              {account.title}
            </h3>
            <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
              {account.description}
            </p>

            <div className="my-5 grid flex-1 grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
              {account.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    {index < account.steps.length - 1 && (
                      <span
                        className="absolute left-[calc(50%+22px)] top-5 hidden w-[calc(100%-28px)] text-border sm:block"
                        aria-hidden
                      >
                        <svg
                          width="100%"
                          height="10"
                          viewBox="0 0 40 10"
                          preserveAspectRatio="none"
                          fill="none"
                        >
                          <path
                            d="M2 5H30"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="2.5 2.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M28 2L34 5L28 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                    <span
                      className={`relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card ${account.theme.iconRing} ${account.theme.icon}`}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                    </span>
                    <p className="mt-2 text-[11px] font-bold leading-tight text-foreground sm:text-xs">
                      {step.title}
                    </p>
                    <p className="mt-0.5 max-w-[7.5rem] text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              href={account.href}
              className={`mt-auto inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold text-white transition ${account.theme.button}`}
            >
              {account.cta}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
