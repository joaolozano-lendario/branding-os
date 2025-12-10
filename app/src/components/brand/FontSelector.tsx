/**
 * FontSelector Component
 * BRAND-001: Configure Visual Identity
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import type { BrandFont } from "@/types/brand"

// Popular Google Fonts for brand typography
const GOOGLE_FONTS = [
  { family: "Inter", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "Source Serif 4", category: "serif", weights: [400, 600] },
  { family: "Playfair Display", category: "serif", weights: [400, 500, 600, 700] },
  { family: "Lora", category: "serif", weights: [400, 500, 600, 700] },
  { family: "Merriweather", category: "serif", weights: [400, 700] },
  { family: "Roboto", category: "sans-serif", weights: [400, 500, 700] },
  { family: "Open Sans", category: "sans-serif", weights: [400, 600, 700] },
  { family: "Montserrat", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "Poppins", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "DM Sans", category: "sans-serif", weights: [400, 500, 700] },
  { family: "Space Grotesk", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "Manrope", category: "sans-serif", weights: [400, 500, 600, 700, 800] },
  { family: "Outfit", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "Plus Jakarta Sans", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "JetBrains Mono", category: "monospace", weights: [400, 500, 700] },
]

interface FontSelectorProps {
  font: BrandFont
  role: "heading" | "body" | "accent"
  onChange: (updates: Partial<BrandFont>) => void
  disabled?: boolean
  className?: string
}

export function FontSelector({
  font,
  role,
  onChange,
  disabled = false,
  className,
}: FontSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredFonts = GOOGLE_FONTS.filter((f) =>
    f.family.toLowerCase().includes(search.toLowerCase())
  )

  const selectedFontInfo = GOOGLE_FONTS.find((f) => f.family === font.family)

  const handleSelect = (selectedFont: typeof GOOGLE_FONTS[0]) => {
    onChange({
      family: selectedFont.family,
      weights: selectedFont.weights,
      source: "google",
    })
    setIsOpen(false)
    setSearch("")
  }

  const roleLabels = {
    heading: "Heading Font",
    body: "Body Font",
    accent: "Accent Font",
  }

  const roleDescriptions = {
    heading: "Used for titles and headings (H1-H6)",
    body: "Used for paragraphs and body text",
    accent: "Used for callouts and special emphasis",
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-2">
        {roleLabels[role]}
        <Badge variant="outline" size="sm">
          {role === "heading" ? "Sans" : role === "body" ? "Serif" : "Optional"}
        </Badge>
      </Label>

      <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>

      {/* Font Selector Button */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full justify-between h-auto py-3"
        >
          <div className="flex items-center gap-3">
            {/* Font Preview */}
            <div
              className="text-2xl leading-none"
              style={{ fontFamily: font.family }}
            >
              Aa
            </div>
            <div className="text-left">
              <div className="font-semibold">{font.family}</div>
              <div className="text-xs text-muted-foreground">
                {selectedFontInfo?.category || "custom"} · {font.weights.length} weights
              </div>
            </div>
          </div>
          <Icon
            name="angle-down"
            size="size-4"
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </Button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Icon
                  name="search"
                  size="size-4"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fonts..."
                  className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>

            {/* Font List */}
            <div className="max-h-64 overflow-y-auto p-1">
              {filteredFonts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No fonts found
                </div>
              ) : (
                filteredFonts.map((f) => (
                  <button
                    key={f.family}
                    onClick={() => handleSelect(f)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent",
                      font.family === f.family && "bg-primary/10"
                    )}
                  >
                    <div
                      className="text-xl leading-none w-8"
                      style={{ fontFamily: f.family }}
                    >
                      Aa
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{f.family}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.category}
                      </div>
                    </div>
                    {font.family === f.family && (
                      <Icon name="check" size="size-4" className="text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Font Preview */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p
          className="text-lg"
          style={{ fontFamily: font.family }}
        >
          The quick brown fox jumps over the lazy dog
        </p>
        <p
          className="text-sm mt-2"
          style={{ fontFamily: font.family }}
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
        </p>
        <p
          className="text-sm text-muted-foreground mt-1"
          style={{ fontFamily: font.family }}
        >
          abcdefghijklmnopqrstuvwxyz 0123456789
        </p>
      </div>
    </div>
  )
}
