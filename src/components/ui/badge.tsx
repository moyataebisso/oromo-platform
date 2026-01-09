import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground border-border/50 bg-background/50 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Gradient variants
        "gradient-blue":
          "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white",
        "gradient-purple":
          "border-transparent bg-gradient-to-r from-purple-500 to-purple-600 text-white",
        "gradient-green":
          "border-transparent bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
        "gradient-amber":
          "border-transparent bg-gradient-to-r from-amber-500 to-amber-600 text-white",
        "gradient-pink":
          "border-transparent bg-gradient-to-r from-pink-500 to-pink-600 text-white",
        "gradient-primary":
          "border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
        // Soft/subtle variants for categories
        "soft-blue":
          "border-transparent bg-blue-500/10 text-blue-400 dark:bg-blue-500/20",
        "soft-purple":
          "border-transparent bg-purple-500/10 text-purple-400 dark:bg-purple-500/20",
        "soft-green":
          "border-transparent bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/20",
        "soft-amber":
          "border-transparent bg-amber-500/10 text-amber-400 dark:bg-amber-500/20",
        "soft-pink":
          "border-transparent bg-pink-500/10 text-pink-400 dark:bg-pink-500/20",
        "soft-red":
          "border-transparent bg-red-500/10 text-red-400 dark:bg-red-500/20",
        // Glow variant
        glow: "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
