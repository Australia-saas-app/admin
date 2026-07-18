"use client";

import { Facebook, Youtube, Instagram, X, MapPin } from "lucide-react";

interface BranchCardProps {
  branchName: string;
  address: string;
  phone: string;
  emailAddress: string | null;
}

export default function BranchCard({ branchName, address, phone, emailAddress }: BranchCardProps) {
  return (
    <article className="card-lift flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="w-[38%] min-w-[120px] max-w-[160px] h-[108px] bg-[#e8f0fe] rounded-md relative shrink-0 overflow-hidden border border-blue-100">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-red-500 drop-shadow-md fill-red-500/20" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1 text-xs text-[#455c83]">
        <h3 className="font-bold text-[#2f3d58] text-sm mb-1">{branchName}</h3>
        <p className="leading-snug">
          <span className="font-semibold text-[#2f3d58]">Address:</span> {address}
        </p>
        <p>
          <span className="font-semibold text-[#2f3d58]">Call:</span> {phone}
        </p>
        {emailAddress && (
          <p className="truncate">
            <span className="font-semibold text-[#2f3d58]">E-Mail:</span> {emailAddress}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <span className="font-semibold text-[#2f3d58] text-[11px]">Contact US</span>
          <X className="h-3.5 w-3.5 cursor-pointer hover:text-[#2f3d58]" />
          <Facebook className="h-3.5 w-3.5 cursor-pointer hover:text-[#2f3d58]" />
          <Youtube className="h-3.5 w-3.5 cursor-pointer hover:text-[#2f3d58]" />
          <Instagram className="h-3.5 w-3.5 cursor-pointer hover:text-[#2f3d58]" />
        </div>
      </div>
    </article>
  );
}
