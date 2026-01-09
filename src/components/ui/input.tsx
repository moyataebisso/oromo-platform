import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border bg-background px-3 py-2 text-base shadow-xs transition-all outline-none",
        "placeholder:text-muted-foreground",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        // Dark mode specific styles
        "dark:bg-card/50 dark:border-border/50",
        // Focus states with glow effect
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
        "focus-visible:shadow-sm focus-visible:shadow-primary/25",
        // Invalid states
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
