/**
 * VoiceAttributesSelector Component
 * BRAND-002: Configure Brand Voice
 * Academia Lendária Design System
 */

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Icon } from "@/components/ui/icon"
import type { VoiceAttribute } from "@/types/brand"

interface VoiceAttributeOption {
  value: VoiceAttribute
  label: string
  description: string
  icon: string
}

const VOICE_ATTRIBUTES: VoiceAttributeOption[] = [
  {
    value: "professional",
    label: "Professional",
    description: "Formal, business-oriented, expert",
    icon: "briefcase",
  },
  {
    value: "playful",
    label: "Playful",
    description: "Fun, lighthearted, engaging",
    icon: "smile",
  },
  {
    value: "authoritative",
    label: "Authoritative",
    description: "Confident, decisive, leading",
    icon: "shield-check",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm, approachable, personal",
    icon: "heart",
  },
  {
    value: "sophisticated",
    label: "Sophisticated",
    description: "Elegant, refined, premium",
    icon: "diamond",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed, conversational, easy",
    icon: "comments",
  },
  {
    value: "inspiring",
    label: "Inspiring",
    description: "Motivational, uplifting, visionary",
    icon: "rocket",
  },
  {
    value: "educational",
    label: "Educational",
    description: "Informative, clear, teaching",
    icon: "book",
  },
  {
    value: "bold",
    label: "Bold",
    description: "Daring, impactful, memorable",
    icon: "bolt",
  },
  {
    value: "empathetic",
    label: "Empathetic",
    description: "Understanding, caring, supportive",
    icon: "hand-holding-heart",
  },
]

interface VoiceAttributesSelectorProps {
  selected: VoiceAttribute[]
  onChange: (attribute: VoiceAttribute) => void
  maxSelect?: number
  disabled?: boolean
  className?: string
}

export function VoiceAttributesSelector({
  selected,
  onChange,
  maxSelect = 5,
  disabled = false,
  className,
}: VoiceAttributesSelectorProps) {
  const canSelectMore = selected.length < maxSelect

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Voice Attributes</Label>
        <span className="text-sm text-muted-foreground">
          {selected.length}/{maxSelect} selected
        </span>
      </div>

      <p className="text-sm text-muted-foreground font-serif">
        Select up to {maxSelect} attributes that define how your brand communicates.
        These will guide the AI in generating on-brand copy.
      </p>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-3">
        {VOICE_ATTRIBUTES.map((attr) => {
          const isSelected = selected.includes(attr.value)
          const isDisabled = disabled || (!isSelected && !canSelectMore)

          return (
            <button
              key={attr.value}
              onClick={() => onChange(attr.value)}
              disabled={isDisabled}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                isDisabled && !isSelected && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon name={attr.icon} size="size-5" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{attr.label}</span>
                  {isSelected && (
                    <Icon name="check-circle" size="size-4" className="text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {attr.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Summary */}
      {selected.length > 0 && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-semibold mb-2">Your brand voice is:</p>
          <p className="text-sm text-muted-foreground font-serif">
            {selected
              .map((s) => VOICE_ATTRIBUTES.find((a) => a.value === s)?.label)
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  )
}
