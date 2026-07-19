import Link from "next/link";
import { Briefcase, Send, UserRound, UserRoundPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface JoinCard {
  label: string;
  hint: string;
  href: string;
  icon: LucideIcon;
  bg: string;
  hover: string;
}

const JOIN_CARDS: JoinCard[] = [
  {
    label: "Join as User",
    hint: "It's Free",
    href: "/account/user/registration",
    icon: UserRound,
    bg: "bg-[#2563EB]",
    hover: "hover:bg-[#1D4ED8]",
  },
  {
    label: "Join as Affiliate",
    hint: "Start Earning",
    href: "/account/affiliate/registration",
    icon: UserRoundPlus,
    bg: "bg-[#7C3AED]",
    hover: "hover:bg-[#6D28D9]",
  },
  {
    label: "Join as Business",
    hint: "Grow Your Brand",
    href: "/account/business/registration",
    icon: Briefcase,
    bg: "bg-[#15803D]",
    hover: "hover:bg-[#166534]",
  },
];

export default function JourneyCTA() {
  return (
    <section className="bg-gradient-to-r from-[#6D28D9] via-[#4C1D95] to-[#0B1220]">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-10">
        <div className="flex min-w-0 items-start gap-4 md:items-center">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center text-white sm:h-14 sm:w-14">
            <Send
              className="h-9 w-9 -rotate-12 sm:h-11 sm:w-11"
              strokeWidth={1.75}
              fill="currentColor"
              aria-hidden
            />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-[1.65rem]">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-1 text-sm text-white/85 sm:text-[15px]">
              Join thousands of users, affiliates and businesses growing with Veror.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 md:w-auto md:min-w-[480px] lg:min-w-[540px]">
          {JOIN_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className={`flex items-center gap-2.5 rounded-lg px-3.5 py-3 text-white transition ${card.bg} ${card.hover}`}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-bold">{card.label}</span>
                  <span className="block text-xs font-normal text-white/90">{card.hint}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
