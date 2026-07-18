import Image from "next/image";
import React from "react";
import { HOME_BLOG_SECTION_DATA, PLATFORM_TAGLINE } from "../constants/home.constants";

export default function MapStats() {
  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="reveal-scroll mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Worldwide
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            Global reach
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {PLATFORM_TAGLINE}
          </p>
        </div>

        <div className="reveal-scroll relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            <div className="relative h-64 w-full md:h-[420px]">
              <Image
                src={HOME_BLOG_SECTION_DATA?.mapImage as string}
                alt="Global network map"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex justify-center px-4">
            <div className="grid w-full max-w-3xl -translate-y-10 grid-cols-3 items-center gap-4 rounded-2xl border border-white/10 bg-primary px-4 py-5 text-primary-foreground shadow-xl shadow-primary/25 backdrop-blur md:px-8 md:py-6">
              {HOME_BLOG_SECTION_DATA?.stats?.map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-extrabold md:text-3xl">{s.value}+</div>
                  <div className="mt-1 text-xs uppercase tracking-wide opacity-90">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
