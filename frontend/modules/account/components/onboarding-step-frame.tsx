"use client";

import type { ReactNode } from "react";

interface OnboardingStepFrameProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function OnboardingStepFrame({ title, description, children }: OnboardingStepFrameProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
