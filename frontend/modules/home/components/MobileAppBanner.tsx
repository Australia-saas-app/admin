import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const APP_STORE_URL = "https://apps.apple.com";
const PLAY_STORE_URL = "https://play.google.com/store";
const QR_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent("https://veror.com/app")}`;

export default function MobileAppBanner() {
  return (
    <section className="bg-[#06153A]">
      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 md:py-9">
        {/* Tech dots — sharp, no blur filter */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[28%] opacity-50 md:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(96,165,250,0.7) 1.25px, transparent 1.35px)",
            backgroundSize: "16px 16px",
            maskImage: "linear-gradient(to right, black 0%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 90%)",
          }}
        />

        <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8 xl:gap-10">
          <PhonePair />

          <div className="min-w-0 flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[1.75rem] md:text-[1.9rem]">
              Work. Earn. Grow. Anywhere
            </h2>
            <p className="mt-2 text-sm text-white/85 sm:text-[15px]">
              Download our mobile app and manage everything on the go.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <StoreBadge
                href={APP_STORE_URL}
                sub="Download on the"
                label="App Store"
                icon={<AppleIcon />}
              />
              <StoreBadge
                href={PLAY_STORE_URL}
                sub="GET IT ON"
                label="Google Play"
                icon={<PlayIcon />}
              />
            </div>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <span className="h-28 w-px shrink-0 bg-white/30" aria-hidden />
            <div className="rounded-2xl bg-white p-2.5 shadow-lg">
              <Image
                src={QR_IMG}
                alt="Scan to download the app"
                width={128}
                height={128}
                unoptimized
                className="h-auto w-32"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhonePair() {
  return (
    <div className="relative flex h-[150px] w-[220px] shrink-0 items-end justify-center sm:h-[170px] sm:w-[250px]">
      <PhoneMock
        className="-mr-6 -rotate-[8deg]"
        header="bg-[#2563EB]"
        accent="from-[#2563EB] to-[#7C3AED]"
      />
      <PhoneMock
        className="-ml-2 rotate-[6deg]"
        header="bg-[#1D4ED8]"
        accent="from-[#16A34A] to-[#2563EB]"
        showBadge
      />
    </div>
  );
}

function PhoneMock({
  className,
  header,
  accent,
  showBadge,
}: {
  className?: string;
  header: string;
  accent: string;
  showBadge?: boolean;
}) {
  return (
    <div
      className={`relative h-[140px] w-[72px] overflow-hidden rounded-[14px] border-[3px] border-[#0F172A] bg-white shadow-xl sm:h-[158px] sm:w-[80px] ${className ?? ""}`}
    >
      <div className={`h-5 w-full ${header}`} />
      <div className="space-y-1.5 p-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                i === 0
                  ? "bg-[#2563EB]"
                  : i === 1
                    ? "bg-[#16A34A]"
                    : i === 2
                      ? "bg-[#F59E0B]"
                      : "bg-[#94A3B8]"
              }`}
            />
            <span className="h-1.5 flex-1 rounded-full bg-[#E2E8F0]" />
            {showBadge && i === 1 ? (
              <span className="h-2 w-5 rounded-full bg-[#22C55E]" />
            ) : (
              <span className="h-1.5 w-3 rounded-full bg-[#CBD5E1]" />
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-x-1.5 bottom-1.5">
        <div className={`h-4 rounded-md bg-gradient-to-r ${accent}`} />
      </div>
    </div>
  );
}

function StoreBadge({
  href,
  label,
  sub,
  icon,
}: {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-2.5 rounded-lg border border-white/30 bg-black px-3.5 text-white transition hover:bg-neutral-900"
    >
      {icon}
      <span className="leading-tight text-left">
        <span className="block text-[9px] font-normal text-white/80">{sub}</span>
        <span className="block text-sm font-semibold tracking-tight">{label}</span>
      </span>
    </Link>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-current" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.21-1.21 3.03-.9.94-2.38 1.66-3.62 1.56-.14-1.1.4-2.27 1.2-3.08.9-.92 2.45-1.6 3.63-1.51zM20.48 17.14c-.58 1.33-.86 1.92-1.61 3.1-1.05 1.63-2.53 3.66-4.37 3.68-1.63.02-2.05-1.07-4.27-1.06-2.22.01-2.68 1.08-4.32 1.06-1.83-.02-3.23-1.85-4.28-3.48C-.05 17.3-.7 13.2.9 10.5c1.13-1.9 2.92-3.01 4.6-3.01 1.71 0 2.78 1.1 4.19 1.1 1.37 0 2.21-1.11 4.2-1.11 1.5 0 3.09.82 4.21 2.23-3.7 2.03-3.1 7.32.38 7.43z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden>
      <path
        fill="#EA4335"
        d="M3.6 2.2l10.1 9.8L3.6 21.7c-.5-.3-.8-.8-.8-1.4V3.6c0-.6.3-1.1.8-1.4z"
      />
      <path fill="#FBBC04" d="M17.4 14.7l-3.7-2.7 3.7-2.7 3.3 1.9c.9.5.9 1.9 0 2.5l-3.3 1.9z" />
      <path fill="#4285F4" d="M3.6 21.7l10.1-9.7 3.7 2.7-11.7 6.7c-.8.5-1.8-.1-2.1-.7z" />
      <path fill="#34A853" d="M3.6 2.2c.3-.6 1.3-1.2 2.1-.7l11.7 6.7-3.7 2.7L3.6 2.2z" />
    </svg>
  );
}
