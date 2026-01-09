import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "shimmer" | "pulse"
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-muted",
        {
          "animate-pulse": variant === "default" || variant === "pulse",
          "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
            variant === "shimmer",
        },
        // Dark mode specific
        "dark:bg-card/50",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
