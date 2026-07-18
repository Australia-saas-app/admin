import * as React from "react"

import { cn } from "@/src/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-white text-slate-900 placeholder:text-slate-500 border-0   disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm transition-all w-full min-h-[80px] p-3 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
