import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text"
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", width, height, style, ...props }, ref) => {
    const variantClasses = {
      default: "rounded-lg",
      circular: "rounded-full",
      text: "rounded h-4",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-muted",
          variantClasses[variant],
          className
        )}
        style={{
          width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
          height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
          ...style,
        }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Pre-built skeleton patterns for common use cases
const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4 rounded-xl border border-border p-6", className)}
        {...props}
      >
        <Skeleton className="h-10 w-10" variant="circular" />
        <Skeleton className="h-4 w-3/4" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-3 w-full" variant="text" />
          <Skeleton className="h-3 w-5/6" variant="text" />
        </div>
      </div>
    )
  }
)
SkeletonCard.displayName = "SkeletonCard"

const SkeletonTable = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { rows?: number }>(
  ({ className, rows = 5, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {/* Header */}
        <div className="flex gap-4 pb-2 border-b border-border">
          <Skeleton className="h-4 w-1/4" variant="text" />
          <Skeleton className="h-4 w-1/4" variant="text" />
          <Skeleton className="h-4 w-1/4" variant="text" />
          <Skeleton className="h-4 w-1/4" variant="text" />
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            <Skeleton className="h-4 w-1/4" variant="text" />
            <Skeleton className="h-4 w-1/4" variant="text" />
            <Skeleton className="h-4 w-1/4" variant="text" />
            <Skeleton className="h-4 w-1/4" variant="text" />
          </div>
        ))}
      </div>
    )
  }
)
SkeletonTable.displayName = "SkeletonTable"

// Gallery card skeleton for asset/example galleries
const SkeletonGalleryCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-xl border border-border overflow-hidden", className)}
        {...props}
      >
        {/* Image placeholder */}
        <Skeleton className="aspect-video w-full" />
        {/* Content */}
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" variant="text" />
          <Skeleton className="h-4 w-1/2" variant="text" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-16" variant="text" />
            <Skeleton className="h-4 w-12" variant="text" />
          </div>
        </div>
      </div>
    )
  }
)
SkeletonGalleryCard.displayName = "SkeletonGalleryCard"

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonGalleryCard }
