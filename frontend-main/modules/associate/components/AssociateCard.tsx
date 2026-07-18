"use client";

import { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Facebook, Youtube, Instagram, X as XIcon, Star } from "lucide-react";
import type { AssociateDemo } from "../demoData";

interface Props {
  data: AssociateDemo;
}

function AssociateCard({ data }: Props) {
  const router = useRouter();
  const rating = data.rating ?? 5;
  const displayId = String(data.id).padStart(5, "0");
  const detailPath = `/associate/${data.id}`;

  const openDetail = () => router.push(detailPath);

  return (
    <article
      className="card-lift flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
      onClick={openDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${data.name}`}
    >
      <div className="w-20 h-20 sm:w-[72px] sm:h-[72px] bg-muted rounded-md shrink-0 flex items-center justify-center overflow-hidden border border-border relative">
        {data.logo ? (
          <Image
            src={data.logo}
            alt={data.company}
            fill
            sizes="80px"
            className="object-contain p-1.5"
            loading="lazy"
          />
        ) : (
          <span className="text-muted-foreground/70 text-[10px]">Logo</span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5 text-xs text-[#455c83]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <h3 className="font-bold text-[#2f3d58] text-sm truncate">{data.name}</h3>
          <span className="text-muted-foreground font-medium text-[11px]">ID : {displayId}</span>
        </div>

        <p className="truncate">
          <span className="font-semibold text-[#2f3d58]">Email:</span> {data.email}
        </p>
        <p className="truncate">
          <span className="font-semibold text-[#2f3d58]">Company:</span> {data.company}
        </p>
        <p className="truncate">
          <span className="font-semibold text-[#2f3d58]">Category:</span> {data.category}
        </p>

        <div className="flex items-center gap-0.5 pt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <div
          className="flex items-center gap-2 pt-1"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <a
            href={`mailto:${data.email}`}
            className="font-semibold text-primary text-[11px] hover:underline"
          >
            Contact us
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <XIcon className="h-3.5 w-3.5 cursor-pointer hover:text-primary" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="h-3.5 w-3.5 cursor-pointer hover:text-primary" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <Youtube className="h-3.5 w-3.5 cursor-pointer hover:text-primary" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="h-3.5 w-3.5 cursor-pointer hover:text-primary" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(AssociateCard);
