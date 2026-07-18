import React from "react";
import Link from "next/link";
import { Bell, ChevronDown, User } from "lucide-react";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Service", href: "/service" },
  { label: "Notice", href: "/notice" },
  { label: "Our Team", href: "/team" },
  { label: "Associate", href: "/associate" },
  { label: "Branch", href: "/branch" },
  { label: "Contact us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-24 items-center justify-center rounded-full border-2 border-primary text-primary font-bold">
              LOGO
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted">
            <span className="flex gap-1 items-center">
              🇮🇳 <span className="font-semibold text-xs ml-1">EN/IND</span>
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
          </div>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
