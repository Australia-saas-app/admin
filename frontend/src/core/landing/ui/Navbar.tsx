"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Feed", href: "#feed" },
  { label: "Services", href: "#services" },
  { label: "Notice", href: "#notice" },
  { label: "Our Team", href: "#team" },
  { label: "Associate", href: "#associate" },
  { label: "Branch", href: "#branch" },
  { label: "Blog", href: "#blog" },
];

interface NavbarProps {
  onSignUp?: () => void;
  showGetStarted?: boolean;
}

export function Navbar({ onSignUp, showGetStarted = true }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo | spacer | nav links + sign up — all in one row */}
        <div className="flex items-center h-16 gap-4">

          {/* Logo — bigger */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo_1.png"
              alt="Logo"
              width={52}
              height={52}
              className="w-12 h-12 object-contain"
              priority
            />
          </Link>

          {/* Spacer pushes everything else to the right */}
          <div className="flex-1" />

          {/* Desktop Nav Links + Sign up — grouped right */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-md transition-colors duration-150 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-full transition-all duration-200" />
              </a>
            ))}

            {showGetStarted && (
              <button
                onClick={onSignUp}
                className="ml-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm shadow-blue-600/20 transition-all duration-150 active:scale-95"
              >
                Sign up
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 space-y-1 shadow-md">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          {showGetStarted && (
            <button
              onClick={() => { setMobileOpen(false); onSignUp?.(); }}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all"
            >
              Sign up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
