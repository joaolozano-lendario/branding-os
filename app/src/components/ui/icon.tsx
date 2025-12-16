import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Icon component for Flaticon UIcons
 * IMPORTANT: Only use Flaticon UIcons - never Lucide, FontAwesome, or other icon libraries
 * 
 * @see https://www.flaticon.com/uicons
 * 
 * Usage:
 * - Regular: <Icon name="home" />
 * - Solid: <Icon name="star" type="solid" />
 * - Brands: <Icon name="google" type="brands" />
 */

export type IconType = "regular" | "solid" | "brands"
export type IconSize = "size-3" | "size-4" | "size-5" | "size-6" | "size-8" | "size-10" | "size-12"

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  type?: IconType
  size?: IconSize
}

const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ name, type = "regular", size = "size-5", className, ...props }, ref) => {
    // Build Flaticon UIcons class
    // Format: fi fi-[type]-[name]
    // Regular: fi fi-rr-home
    // Solid: fi fi-sr-star
    // Brands: fi fi-brands-google
    
    const typePrefix = type === "regular" ? "rr" : type === "solid" ? "sr" : "brands"
    const iconClass = `fi fi-${typePrefix}-${name}`
    
    return (
      <i
        ref={ref as React.Ref<HTMLElement>}
        className={cn(iconClass, size, "inline-flex items-center justify-center leading-none", className)}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"

export { Icon }
