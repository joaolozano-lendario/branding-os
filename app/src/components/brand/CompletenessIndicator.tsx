/**
 * CompletenessIndicator Component
 * BRAND-004: Brand Configuration Dashboard
 * Circular progress indicator for brand completeness
 * Academia Lendária Design System
 */

import { cn } from "@/lib/utils"

interface CompletenessIndicatorProps {
  value: number // 0-100
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  className?: string
}

const SIZE_CONFIG = {
  sm: { size: 48, strokeWidth: 4, fontSize: "text-xs" },
  md: { size: 80, strokeWidth: 6, fontSize: "text-lg" },
  lg: { size: 120, strokeWidth: 8, fontSize: "text-2xl" },
}

export function CompletenessIndicator({
  value,
  size = "md",
  showLabel = true,
  label,
  className,
}: CompletenessIndicatorProps) {
  const config = SIZE_CONFIG[size]
  const radius = (config.size - config.strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  // Color based on completeness
  const getColor = () => {
    if (value >= 80) return "text-success"
    if (value >= 50) return "text-warning"
    return "text-muted-foreground"
  }

  const getStrokeColor = () => {
    if (value >= 80) return "stroke-success"
    if (value >= 50) return "stroke-warning"
    if (value >= 20) return "stroke-primary"
    return "stroke-muted"
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: config.size, height: config.size }}>
        {/* Background Circle */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.size}
          height={config.size}
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted/30"
          />
        </svg>

        {/* Progress Circle */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.size}
          height={config.size}
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            className={cn("transition-all duration-500", getStrokeColor())}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>

        {/* Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", config.fontSize, getColor())}>
            {Math.round(value)}%
          </span>
        </div>
      </div>

      {/* Label */}
      {showLabel && label && (
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  )
}

// Breakdown variant showing multiple sections
interface CompletenessBreakdownProps {
  sections: {
    label: string
    value: number
    icon?: string
  }[]
  className?: string
}

export function CompletenessBreakdown({ sections, className }: CompletenessBreakdownProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {sections.map((section, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{section.label}</span>
            <span className="font-semibold">{section.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                section.value >= 80
                  ? "bg-success"
                  : section.value >= 50
                  ? "bg-warning"
                  : section.value >= 20
                  ? "bg-primary"
                  : "bg-muted-foreground"
              )}
              style={{ width: `${section.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
