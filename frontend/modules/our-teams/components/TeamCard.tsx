"use client";

import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function TeamCard({
  firstName,
  lastName,
  position,
  department,
  bio,
  photoUrl,
  linkedinUrl,
  employeeId,
  salary,
  hireDate,
  createdAt,
  updatedAt,
}: {
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  bio: string;
  photoUrl: string | null;
  linkedinUrl: string;
  employeeId: string;
  salary: string;
  hireDate: string | null;
  createdAt: string;
  updatedAt: string;
}) {
  const defaultPhoto =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(`${firstName}+${lastName}`) +
    "&background=random";

  return (
    <div className="card-lift flex flex-col items-center rounded-2xl border border-border bg-card p-4 text-center">
      {/* Circular Profile Image with double ring border */}
      <div className="mb-2 mt-0">
        <div className="w-24 h-24 rounded-full p-[3px] border-2 border-border flex items-center justify-center bg-card">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={photoUrl || defaultPhoto}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Team Member Info */}
      <div className="mb-2">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide leading-tight">
          {firstName} {lastName}
        </h3>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
          {position || "Team Member"}
        </p>
        <p className="text-[9px] font-semibold text-muted-foreground/80 uppercase tracking-wider mt-0.5">
          {department || ""}
        </p>
      </div>

      {/* Social Media Row with pipes */}
      <div className="flex items-center justify-center gap-0 text-slate-500 mt-auto pt-1.5 border-t border-slate-100 w-full">
        <a
          href={linkedinUrl || "https://linkedin.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 hover:text-[#3b5998] transition-colors"
          aria-label="LinkedIn profile"
        >
          <Facebook className="w-3.5 h-3.5 fill-current stroke-0" />
        </a>
        <span className="text-slate-300 select-none text-xs">|</span>
        <a
          href={linkedinUrl || "https://instagram.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 hover:text-[#e1306c] transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-3.5 h-3.5" />
        </a>
        <span className="text-slate-300 select-none text-xs">|</span>
        <a
          href={linkedinUrl || "https://twitter.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 hover:text-[#1da1f2] transition-colors"
          aria-label="Twitter"
        >
          <Twitter className="w-3.5 h-3.5 fill-current stroke-0" />
        </a>
        <span className="text-slate-300 select-none text-xs">|</span>
        <a
          href={linkedinUrl || "https://youtube.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 hover:text-[#ff0000] transition-colors"
          aria-label="YouTube"
        >
          <Youtube className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
