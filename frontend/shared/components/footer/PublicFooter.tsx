import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Facebook, Youtube, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";

const FOOTER_LINKS = [
  { href: "/advertising", label: "Advertising practices" },
  { href: "/privacy", label: "Your privacy policies" },
  { href: "/sitemap", label: "Sitemap" },
  { href: "/careers", label: "Careers" },
  { href: "/associate", label: "Associate program" },
  { href: "/blogs", label: "Blog" },
] as const;

export function PublicFooter() {
  return (
    <footer className="bg-[#eef2f5] border-t border-border py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center gap-8">
          
          {/* Top Dropdowns */}
          <div className="flex gap-4">
            <select className="px-4 py-2 bg-white border border-border rounded-md text-sm outline-none w-32">
              <option>English</option>
            </select>
            <select className="px-4 py-2 bg-white border border-border rounded-md text-sm outline-none w-32">
              <option>🇮🇳 India</option>
            </select>
            <select className="px-4 py-2 bg-white border border-border rounded-md text-sm outline-none w-32">
              <option>USD</option>
            </select>
          </div>

          <div className="w-full h-px bg-border my-2" />

          {/* Links */}
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact US Button */}
          <Button asChild className="bg-[#5c728e] hover:bg-[#4a5c73] text-white mt-2 px-8">
            <Link href="/associate">Contact US</Link>
          </Button>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            <div className="h-10 w-10 bg-[#5c728e] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4a5c73] transition-colors">
              <Facebook className="h-5 w-5 fill-current" />
            </div>
            <div className="h-10 w-10 bg-[#5c728e] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4a5c73] transition-colors">
              <Youtube className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 bg-[#5c728e] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4a5c73] transition-colors">
              <SiTiktok className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 bg-[#5c728e] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4a5c73] transition-colors">
              <Twitter className="h-5 w-5 fill-current" />
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-4 opacity-80">
            <div className="h-8 w-24 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500">Bitcoin</div>
            <div className="h-8 w-24 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500">Payoneer</div>
            <div className="h-8 w-24 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500">Bank</div>
            <div className="h-8 w-24 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500">PayPal</div>
            <div className="h-8 w-24 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500">SBI</div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground mt-4">
            © 2000 - 2026 All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
