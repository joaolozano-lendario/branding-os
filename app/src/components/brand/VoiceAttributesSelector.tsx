/**
 * VoiceAttributesSelector Component
 * BRAND-002: Configure Brand Voice
 * Academia Lendária Design System
 * i18n: Full translation support
 */

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Icon } from "@/components/ui/icon"
import { useTranslation } from "@/store/i18nStore"
import type { VoiceAttribute } from "@/types/brand"

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
  const { t } = useTranslation()
  const canSelectMore = selected.length < maxSelect

  const VOICE_ATTRIBUTES: { value: VoiceAttribute; labelKey: keyof typeof t.brand.voice; descKey: keyof typeof t.brand.voice; icon: string }[] = [
    { value: "professional", labelKey: "professional", descKey: "professionalDesc", icon: "briefcase" },
    { value: "playful", labelKey: "playful", descKey: "playfulDesc", icon: "smile" },
    { value: "authoritative", labelKey: "authoritative", descKey: "authoritativeDesc", icon: "shield-check" },
    { value: "friendly", labelKey: "friendly", descKey: "friendlyDesc", icon: "heart" },
    { value: "sophisticated", labelKey: "sophisticated", descKey: "sophisticatedDesc", icon: "diamond" },
    { value: "casual", labelKey: "casual", descKey: "casualDesc", icon: "comments" },
    { value: "inspiring", labelKey: "inspiring", descKey: "inspiringDesc", icon: "rocket" },
    { value: "educational", labelKey: "educational", descKey: "educationalDesc", icon: "book" },
    { value: "bold", labelKey: "bold", descKey: "boldDesc", icon: "bolt" },
    { value: "empathetic", labelKey: "empathetic", descKey: "empatheticDesc", icon: "hand-holding-heart" },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>{t.brand.voice.attributes}</Label>
        <span className="text-sm text-muted-foreground">
          {selected.length}/{maxSelect} {t.brand.voice.selected}
        </span>
      </div>

      <p className="text-sm text-muted-foreground font-serif">
        {t.brand.voice.attributesHelp.replace('{max}', String(maxSelect))}
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
                  <span className="font-semibold text-sm">
                    {t.brand.voice[attr.labelKey] as string}
                  </span>
                  {isSelected && (
                    <Icon name="check-circle" size="size-4" className="text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {t.brand.voice[attr.descKey] as string}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Summary */}
      {selected.length > 0 && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-semibold mb-2">{t.brand.voice.yourVoiceIs}</p>
          <p className="text-sm text-muted-foreground font-serif">
            {selected
              .map((s) => {
                const attr = VOICE_ATTRIBUTES.find((a) => a.value === s)
                return attr ? t.brand.voice[attr.labelKey] as string : null
              })
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  )
}
