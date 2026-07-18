"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutGrid, Menu, MessageSquare, Search, User, Wallet, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "@/src/components/ui/NavLink";
import { Spinner } from "@/src/components/ui/Spinner";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useUser } from "@/src/context/user.provider";
import { usePermission } from "@/src/hooks/permission.hook";
import { adminAppPath } from "@/src/constants/app-urls";
import { ThemeToggle } from "@/src/shared/components/ThemeToggle";
import UniversalSearch from "@/src/modules/shared/components/search/UniversalSearch";
import ServicesMegaMenu from "@/src/modules/shared/components/search/ServicesMegaMenu";
import { PRIMARY_NAV } from "@/src/shared/constants/mega-menu";

const iconButtonClass =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary";

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const { user, isLoading } = useUser();
  const { isAdmin, isAffiliate, isBusiness } = usePermission();

  const accountHref = useMemo(() => {
    if (isAdmin) return adminAppPath("/admin/dashboard");
    if (isBusiness) return "/business/dashboard";
    if (isAffiliate) return "/affiliate/dashboard";
    return "/user/dashboard";
  }, [isAdmin, isAffiliate, isBusiness]);

  const messagesHref = useMemo(() => {
    if (isBusiness) return "/business/messages";
    if (isAffiliate) return "/affiliate/messages";
    return "/user/messages";
  }, [isAffiliate, isBusiness]);

  const walletHref = useMemo(() => {
    if (isBusiness) return "/business/wallet";
    if (isAffiliate) return "/affiliate/wallet";
    return "/user/wallet";
  }, [isAffiliate, isBusiness]);

  const noticesHref = useMemo(() => {
    if (!user) return "/notice";
    if (isBusiness) return "/business/notices";
    if (isAffiliate) return "/affiliate/notices";
    return "/user/notices";
  }, [user, isAffiliate, isBusiness]);

  const userInitial = useMemo(() => {
    if (!user) return null;
    const source = ("name" in user && user.name) || ("email" in user && user.email) || "";
    return source.trim().charAt(0).toUpperCase() || null;
  }, [user]);

  const goToAccount = () => {
    if (isAdmin) {
      window.location.assign(accountHref);
      return;
    }
    router.push(accountHref);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:shadow-[0_1px_2px_rgb(0_0_0/0.25)]">
      <div className="relative">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="flex h-14 items-center gap-2 sm:h-16 sm:gap-3 md:h-[4.25rem] md:gap-4">
            <NavLink href="/" exact className="flex shrink-0 items-center gap-2">
              <Image
                src="/newLogo.png"
                alt="System DB"
                width={56}
                height={36}
                className="h-7 w-auto sm:h-9"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </NavLink>

            <div className="hidden min-w-0 max-w-[160px] flex-1 md:block lg:max-w-[200px] xl:max-w-[260px]">
              <UniversalSearch variant="header" />
            </div>
            <Link
              href="/search"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary sm:h-10 sm:w-10 md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>

            <nav
              aria-label="Primary"
              className="ml-auto hidden items-center gap-0 lg:flex xl:gap-0.5"
            >
              {PRIMARY_NAV.map((item) => {
                const active = isActive(item.href);
                const compactHide =
                  item.label === "Our Team" || item.label === "Branch" || item.label === "Blog"
                    ? "hidden xl:inline-flex"
                    : "inline-flex";
                if (item.mega) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setMegaOpen((v) => !v);
                      }}
                      className={`${compactHide} items-center rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors xl:px-2.5 xl:text-sm ${
                        megaOpen || active
                          ? "font-semibold text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMegaOpen(false)}
                    className={`${compactHide} items-center rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors xl:px-2.5 xl:text-sm ${
                      active ? "font-semibold text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 lg:ml-1">
              <ThemeToggle
                compact
                className="hidden !rounded-full !border-transparent !bg-transparent !text-muted-foreground hover:!bg-primary/10 hover:!text-primary md:inline-flex"
              />

              {user && (
                <>
                  <Link
                    href={messagesHref}
                    className={`hidden md:inline-flex ${iconButtonClass}`}
                    title="Messages"
                    aria-label="Messages"
                  >
                    <MessageSquare className="h-[18px] w-[18px]" />
                  </Link>
                  <Link
                    href={walletHref}
                    className={`hidden md:inline-flex ${iconButtonClass}`}
                    title="Wallet"
                    aria-label="Wallet"
                  >
                    <Wallet className="h-[18px] w-[18px]" />
                  </Link>
                </>
              )}

              <Link
                href={noticesHref}
                className={`hidden sm:inline-flex ${iconButtonClass}`}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
              </Link>

              {isLoading ? (
                <Spinner size={18} label={t.common.header.checkingSession} />
              ) : user ? (
                <button
                  type="button"
                  onClick={goToAccount}
                  className="group inline-flex h-10 items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-primary/10 xl:pr-3"
                  title={t.common.header.myAccount}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-2 ring-primary/20 transition group-hover:ring-primary/40">
                    {userInitial ?? <User className="h-4 w-4" />}
                  </span>
                  <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-foreground xl:inline">
                    Account
                  </span>
                </button>
              ) : (
                <Link
                  href="/account/user/registration"
                  className="inline-flex h-9 items-center rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:px-5"
                >
                  Sign up
                </Link>
              )}

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
                onClick={() => {
                  setMegaOpen(false);
                  setMobileOpen((v) => !v);
                }}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {megaOpen && (
          <div className="absolute inset-x-0 top-full z-[60]">
            <ServicesMegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
          </div>
        )}
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="relative z-50 animate-in fade-in slide-in-from-top-2 border-b border-border bg-background py-4 duration-200 lg:hidden">
            <div className="mx-auto max-h-[75vh] max-w-[1400px] overflow-y-auto px-4">
              <div className="mb-4 md:hidden">
                <UniversalSearch variant="header" />
              </div>
              <nav className="mb-4 grid grid-cols-2 gap-1">
                {PRIMARY_NAV.map((item) => {
                  if (item.mega) {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          setMegaOpen(true);
                        }}
                        className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {item.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                        isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground/90"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <ThemeToggle compact className="!rounded-full" />
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setMegaOpen(true);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  All Services
                </button>
                {!user && (
                  <Link
                    href="/account/user/registration"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground sm:flex-none"
                  >
                    Sign up
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
