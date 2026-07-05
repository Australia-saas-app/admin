"use client"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-col w-full  mb-5 mx-auto md:flex-row gap-10 items-center justify-center">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center w-full md:w-auto">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="text-blue-600">{index + 1}</span>
            </div>
            <label
              className={`ml-3 text-sm font-medium hidden md:inline ${
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step}
            </label>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 md:mx-4 transition-colors ${index < currentStep ? "bg-primary" : "bg-muted"}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
