"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp, Headset, Linkedin, Mail } from "lucide-react";
import SimpleSelect from "@/src/components/ui/SimpleSelect";
import ImageIcons from "@/src/components/ui/ImageIcons";
import { ChatBoxManage } from "../chat-bot/ChatBotManage";
import { useLocale } from "@/src/shared/context/locale.provider";
import { LANGUAGE_OPTIONS, type Locale } from "@/src/shared/i18n/types";
import {
  COUNTRY_OPTIONS,
  CURRENCY_OPTIONS,
  type Country,
  type Currency,
} from "@/src/shared/i18n/country";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-3h2.2V9.1c0-2.2 1.3-3.5 3.3-3.5.96 0 1.96.17 1.96.17v2.2h-1.12c-1.1 0-1.44.68-1.44 1.37V12h2.45l-.39 3h-2.06v7A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M23 7s-.2-1.5-.8-2.2c-.7-.9-1.6-.9-2-1C16.6 3 12 3 12 3s-4.6 0-8.2.8c-.4.1-1.3.1-2 .9C1.2 5.6 1 7 1 7S0.8 9 .8 10.1 1 13 1 13s.2 1.4.8 2.1c.7.9 1.6.9 2 1C7.4 17 12 17 12 17s4.6 0 8.2-.8c.4-.1 1.3-.1 2-.9.6-.7.8-2.1.8-2.1s.2-1.9.2-3.1S23 7 23 7zM9.5 12.6V7.4L15 10l-5.5 2.6z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
        <path d="M19.6 7.2A5.7 5.7 0 0116 6.1V15a4.9 4.9 0 11-4.9-4.9c.3 0 .5 0 .8.1v2.4a2.5 2.5 0 103.1 2.4V2.5h2.5a5.7 5.7 0 002.1 4.7z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M18.9 2H22l-6.8 7.8L23 22h-6.5l-5.1-6.7L5.7 22H2.5l7.3-8.3L1.5 2h6.6l4.6 6.1L18.9 2zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: <Linkedin className="h-4 w-4" strokeWidth={2.25} aria-hidden />,
  },
];

const Footer = () => {
  const { locale, setLocale, country, setCountry, currency, setCurrency, t } = useLocale();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const countryOptions = useMemo(
    () =>
      COUNTRY_OPTIONS.map((option) => ({
        value: option.value,
        label: t.common.countries[option.labelKey],
      })),
    [t]
  );

  const currencyOptions = useMemo(
    () =>
      CURRENCY_OPTIONS.map((option) => ({
        value: option.value,
        label: t.common.currencies[option.labelKey],
      })),
    [t]
  );

  const linkColumns = useMemo(
    () => [
      {
        title: "Marketplace",
        links: [
          { label: t.common.footer.links.marketplace, href: "/marketplace" },
          { label: t.common.footer.links.transport, href: "/transport" },
          { label: t.common.footer.links.realEstate, href: "/real-estate" },
          { label: t.common.footer.links.visaProcessing, href: "/visa" },
          { label: t.common.footer.links.visaTravel, href: "/visa-travel" },
        ],
      },
      {
        title: "Grow",
        links: [
          { label: t.common.footer.links.careers, href: "/careers" },
          { label: t.common.footer.links.courses, href: "/courses" },
          { label: t.common.footer.links.advertising, href: "/advertising" },
          { label: "Online Banking", href: "/online-banking" },
          { label: "Associate", href: "/associate" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: t.common.footer.links.branch, href: "/branch" },
          { label: t.common.footer.links.latestNews, href: "/blogs" },
          { label: t.common.footer.links.notice, href: "/notice" },
          { label: "Our Team", href: "/our-teams" },
          { label: "Contact", href: "/contact" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: t.common.footer.links.sitemap, href: "/sitemap" },
        ],
      },
    ],
    [t]
  );

  return (
    <footer className="relative overflow-hidden border-t border-[#D7EBE5] bg-[#F0F9F7] text-[#13393A] dark:border-border dark:bg-card dark:text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 opacity-60 dark:opacity-25"
      >
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-full w-full"
        >
          <path
            d="M0 90C180 140 360 20 540 60C720 100 900 150 1080 100C1260 50 1350 80 1440 70V160H0V90Z"
            fill="rgba(15,107,92,0.08)"
          />
          <path
            d="M0 110C200 150 380 70 560 95C740 120 920 155 1100 115C1280 75 1360 100 1440 95V160H0V110Z"
            fill="rgba(15,107,92,0.06)"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-12">
          {/* Brand column */}
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/newLogo.png"
                alt="Veror"
                width={56}
                height={36}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <p className="mt-3 text-xs font-bold tracking-widest text-foreground sm:text-sm">
              {t.common.footer.storeHeading}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Connect with verified businesses, affiliates, and services across our global network.
            </p>

            {/* CTAs + social in one organized row that wraps */}
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/contact"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-[#0F6B5C] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0C564A] sm:px-4 sm:text-sm dark:bg-primary dark:hover:brightness-110"
                >
                  {t.common.footer.globalAgency}
                </Link>
                <Link
                  href="/branch"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-[#0F6B5C] bg-transparent px-3.5 text-xs font-semibold text-[#0F6B5C] transition hover:bg-[#0F6B5C]/10 sm:px-4 sm:text-sm dark:border-primary dark:text-primary dark:hover:bg-primary/10"
                >
                  {t.common.footer.globalBranch}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#0F6B5C] bg-transparent px-3.5 text-xs font-semibold text-[#0F6B5C] transition hover:bg-[#0F6B5C]/10 sm:px-4 sm:text-sm dark:border-primary dark:text-primary dark:hover:bg-primary/10"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t.common.footer.contactUs}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition hover:text-[#0F6B5C] dark:bg-background dark:text-foreground dark:hover:text-primary"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
            {linkColumns.map((column) => (
              <nav key={column.title} aria-label={column.title} className="min-w-0">
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#0F6B5C] sm:mb-4 sm:text-xs dark:text-primary">
                  {column.title}
                </h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-foreground/80 transition-colors hover:text-[#0F6B5C] sm:text-sm dark:hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-6 border-t border-[#D7EBE5] pt-7 dark:border-border sm:mt-12 sm:pt-8">
          <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3">
            <SimpleSelect
              className="min-w-[96px] cursor-pointer rounded-lg border border-[#13393A]/10 bg-white px-2.5 py-2 text-xs text-[#13393A] shadow-sm sm:min-w-[110px] sm:px-3 sm:text-sm dark:border-border dark:bg-background dark:text-foreground"
              options={LANGUAGE_OPTIONS}
              value={locale}
              onChange={(value) => setLocale(value as Locale)}
              placeholder="English"
            />
            <SimpleSelect
              className="min-w-[96px] cursor-pointer rounded-lg border border-[#13393A]/10 bg-white px-2.5 py-2 text-xs text-[#13393A] shadow-sm sm:min-w-[110px] sm:px-3 sm:text-sm dark:border-border dark:bg-background dark:text-foreground"
              options={countryOptions}
              value={country}
              onChange={(value) => setCountry(value as Country)}
              placeholder={t.common.countries.india}
            />
            <SimpleSelect
              className="min-w-[96px] cursor-pointer rounded-lg border border-[#13393A]/10 bg-white px-2.5 py-2 text-xs text-[#13393A] shadow-sm sm:min-w-[110px] sm:px-3 sm:text-sm dark:border-border dark:bg-background dark:text-foreground"
              options={currencyOptions}
              value={currency}
              onChange={(value) => setCurrency(value as Currency)}
              placeholder={t.common.currencies.usd}
            />
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-90 sm:gap-x-8">
            <ImageIcons.IconBitcoinImg size={36} />
            <ImageIcons.IconPayoneerImg size={44} />
            <ImageIcons.IconBankImg size={30} />
            <ImageIcons.IconPaypalImg size={38} />
            <ImageIcons.IconSbiImg size={34} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
          <span
            className="hidden h-px w-12 bg-[#CBD5E1] dark:bg-border sm:block sm:w-16"
            aria-hidden
          />
          <p className="px-2 text-center text-[11px] text-muted-foreground sm:text-sm">
            {t.common.footer.copyright}
          </p>
          <span
            className="hidden h-px w-12 bg-[#CBD5E1] dark:bg-border sm:block sm:w-16"
            aria-hidden
          />
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-3 bottom-20 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#0F6B5C] text-white shadow-lg transition hover:brightness-110 sm:right-5 sm:bottom-24 sm:h-11 sm:w-11 md:right-6 dark:bg-primary"
      >
        <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <div className="fixed right-3 bottom-3 z-50 sm:right-5 sm:bottom-5">
        <button
          type="button"
          aria-label={
            isChatModalOpen
              ? "Close support chat"
              : isChatMinimized
                ? "Restore support chat"
                : "Open support chat"
          }
          onClick={() => {
            if (isChatMinimized) {
              setIsChatMinimized(false);
              setIsChatModalOpen(true);
              return;
            }
            if (isChatModalOpen) {
              setIsChatMinimized(true);
              setIsChatModalOpen(false);
              return;
            }
            setIsChatModalOpen(true);
          }}
          className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#0F6B5C] text-white shadow-xl transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14 dark:bg-primary"
        >
          <Headset className="h-5 w-5 sm:h-6 sm:w-6" />
          {isChatMinimized && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-[#0F6B5C] dark:ring-primary" />
          )}
        </button>
      </div>
      {(isChatModalOpen || isChatMinimized) && (
        <ChatBoxManage
          isOpen={isChatModalOpen}
          setMinimise={(value) => {
            setIsChatMinimized(value);
            if (value) setIsChatModalOpen(false);
          }}
          setIsChatModalOpen={(value) => {
            if (!value) {
              setIsChatModalOpen(false);
              setIsChatMinimized(false);
              return;
            }
            setIsChatModalOpen(true);
            setIsChatMinimized(false);
          }}
        />
      )}
    </footer>
  );
};

export default Footer;
