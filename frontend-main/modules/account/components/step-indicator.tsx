"use client";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  index <= currentStep ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`hidden text-xs font-medium sm:inline ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-10 ${index < currentStep ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground sm:hidden">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </p>
    </div>
  );
}
