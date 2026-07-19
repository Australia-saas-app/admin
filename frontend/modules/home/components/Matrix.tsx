import React from "react";
import { METRICS, PLATFORM_TAGLINE } from "../constants/home.constants";

export default function Matrix() {
  return (
    <section aria-label="metrics" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal-scroll mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Numbers</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            Platform at a glance
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {PLATFORM_TAGLINE}
          </p>
        </div>

        <div className="reveal-scroll rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-center md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.id} className="flex flex-col items-center">
                <div className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                  {m.value}
                </div>
                <div className="mt-2 text-sm font-medium text-foreground/80">{m.label}</div>
                {m.hint && <div className="mt-1 text-[11px] text-muted-foreground">{m.hint}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
