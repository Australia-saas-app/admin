"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MEGA_MENU_SECTIONS } from "@/src/shared/constants/mega-menu";

type ServicesMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function ServicesMegaMenu({ open, onClose }: ServicesMegaMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[55] cursor-default bg-black/25"
        aria-label="Close services menu"
        onClick={onClose}
      />
      <div className="relative z-[60] animate-in fade-in slide-in-from-top-2 border-b border-border bg-background shadow-xl duration-200 md:mx-auto md:max-w-[1100px] md:rounded-b-2xl md:border-x md:border-b">
        <div className="px-4 py-5 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              All Services
            </h2>
            <Link
              href="/sitemap"
              onClick={onClose}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View sitemap →
            </Link>
          </div>
          <div className="grid max-h-[70vh] grid-cols-2 gap-5 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
            {MEGA_MENU_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary/80">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
