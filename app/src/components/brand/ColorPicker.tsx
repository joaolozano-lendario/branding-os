/**
 * ColorPicker Component
 * BRAND-001: Configure Visual Identity
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import type { BrandColor } from "@/types/brand"
import { isValidHexColor } from "@/types/brand"

interface ColorPickerProps {
  color: BrandColor
  onChange: (updates: Partial<BrandColor>) => void
  onRemove?: () => void
  showRemove?: boolean
  disabled?: boolean
}

// Calculate relative luminance for WCAG contrast
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getWCAGLevel(ratio: number): { level: string; variant: "success" | "warning" | "destructive" } {
  if (ratio >= 7) return { level: "AAA", variant: "success" }
  if (ratio >= 4.5) return { level: "AA", variant: "success" }
  if (ratio >= 3) return { level: "AA Large", variant: "warning" }
  return { level: "Fail", variant: "destructive" }
}

export function ColorPicker({
  color,
  onChange,
  onRemove,
  showRemove = false,
  disabled = false,
}: ColorPickerProps) {
  const [localHex, setLocalHex] = React.useState(color.hex)
  const [isValid, setIsValid] = React.useState(true)

  // Contrast ratio against white and black backgrounds
  const contrastWhite = getContrastRatio(color.hex, "#FFFFFF")
  const contrastBlack = getContrastRatio(color.hex, "#000000")
  const bestContrast = Math.max(contrastWhite, contrastBlack)
  const wcagInfo = getWCAGLevel(bestContrast)

  const handleHexChange = (value: string) => {
    // Auto-add # if missing
    const hex = value.startsWith("#") ? value : `#${value}`
    setLocalHex(hex)

    if (isValidHexColor(hex)) {
      setIsValid(true)
      onChange({ hex, wcagCompliant: bestContrast >= 4.5 })
    } else {
      setIsValid(false)
    }
  }

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setLocalHex(hex)
    setIsValid(true)
    onChange({ hex, wcagCompliant: getContrastRatio(hex, "#FFFFFF") >= 4.5 || getContrastRatio(hex, "#000000") >= 4.5 })
  }

  return (
    <div className={cn("group relative rounded-lg border border-border p-4 transition-colors hover:border-primary/50", disabled && "opacity-50 pointer-events-none")}>
      <div className="flex items-start gap-4">
        {/* Color Preview */}
        <div className="relative">
          <div
            className="h-16 w-16 rounded-lg border border-border shadow-sm cursor-pointer overflow-hidden"
            style={{ backgroundColor: color.hex }}
          >
            <input
              type="color"
              value={color.hex}
              onChange={handleColorInputChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Color Details */}
        <div className="flex-1 space-y-3">
          {/* Name Input */}
          <div className="space-y-1">
            <Label htmlFor={`color-name-${color.id}`} className="text-xs">
              Color Name
            </Label>
            <Input
              id={`color-name-${color.id}`}
              value={color.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g., Brand Gold"
              className="h-8 text-sm"
              disabled={disabled}
            />
          </div>

          {/* Hex Input */}
          <div className="space-y-1">
            <Label htmlFor={`color-hex-${color.id}`} className="text-xs">
              Hex Value
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={`color-hex-${color.id}`}
                value={localHex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#C9B298"
                className={cn("h-8 font-mono text-sm uppercase", !isValid && "border-destructive focus-visible:ring-destructive")}
                maxLength={7}
                disabled={disabled}
              />
              <Badge variant={wcagInfo.variant} size="sm">
                {wcagInfo.level}
              </Badge>
            </div>
            {!isValid && (
              <p className="text-xs text-destructive">Invalid hex color format</p>
            )}
          </div>

          {/* Contrast Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded border bg-white" />
              {contrastWhite.toFixed(1)}:1
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded border bg-black" />
              {contrastBlack.toFixed(1)}:1
            </span>
          </div>
        </div>

        {/* Remove Button */}
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={disabled}
            aria-label="Remove color"
          >
            <Icon name="trash" size="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Color Palette Preview Component
interface ColorPalettePreviewProps {
  colors: BrandColor[]
  className?: string
}

export function ColorPalettePreview({ colors, className }: ColorPalettePreviewProps) {
  return (
    <div className={cn("flex gap-1 rounded-lg overflow-hidden", className)}>
      {colors.map((color) => (
        <div
          key={color.id}
          className="h-8 flex-1 first:rounded-l-lg last:rounded-r-lg"
          style={{ backgroundColor: color.hex }}
          title={`${color.name}: ${color.hex}`}
        />
      ))}
    </div>
  )
}
