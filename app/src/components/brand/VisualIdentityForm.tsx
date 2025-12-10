/**
 * VisualIdentityForm Component
 * BRAND-001: Configure Visual Identity
 * Main form for configuring brand visual identity (logo, colors, fonts)
 * Academia Lendária Design System
 */

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogoUploader } from "./LogoUploader"
import { ColorPicker, ColorPalettePreview } from "./ColorPicker"
import { FontSelector } from "./FontSelector"
import { useBrandStore, selectVisualIdentity, selectHasUnsavedChanges } from "@/store/brandStore"
import type { BrandColor } from "@/types/brand"

interface VisualIdentityFormProps {
  className?: string
}

export function VisualIdentityForm({ className }: VisualIdentityFormProps) {
  const visualIdentity = useBrandStore(selectVisualIdentity)
  const hasUnsavedChanges = useBrandStore(selectHasUnsavedChanges)
  const {
    updateLogo,
    addColor,
    updateColor,
    removeColor,
    updateTypography,
    saveConfig,
    isSaving,
  } = useBrandStore()

  const handleAddCustomColor = () => {
    const newColor: BrandColor = {
      id: crypto.randomUUID(),
      name: `Custom ${visualIdentity.colors.custom.length + 1}`,
      hex: "#737373",
      role: "custom",
      wcagCompliant: true,
    }
    addColor(newColor)
  }

  const handleSave = async () => {
    try {
      await saveConfig()
    } catch (error) {
      console.error("Failed to save:", error)
    }
  }

  // Calculate all colors for palette preview
  const allColors = [
    visualIdentity.colors.primary,
    visualIdentity.colors.secondary,
    visualIdentity.colors.accent,
    ...visualIdentity.colors.custom,
  ]

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold tracking-tight">
            Visual Identity
          </h2>
          <p className="font-serif text-muted-foreground mt-1">
            Configure your brand's logo, colors, and typography
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge variant="warning" size="sm">
              Unsaved changes
            </Badge>
          )}
          <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
            {isSaving ? (
              <>
                <Icon name="spinner" size="size-4" className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon name="check" size="size-4" className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="picture" size="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Logo</CardTitle>
              <CardDescription>
                Upload your brand logo in PNG or SVG format
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LogoUploader
            logo={visualIdentity.logo}
            onUpload={updateLogo}
            onRemove={() =>
              updateLogo({
                file: null,
                url: null,
                fileName: null,
                fileType: null,
                uploadedAt: null,
              })
            }
          />
        </CardContent>
      </Card>

      {/* Colors Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="palette" size="size-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Color Palette</CardTitle>
              <CardDescription>
                Define your brand colors with WCAG contrast validation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Palette Preview */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Preview</Label>
            <ColorPalettePreview colors={allColors} className="h-12" />
          </div>

          <Separator />

          {/* Primary Colors */}
          <div className="space-y-4">
            <Label>Brand Colors</Label>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ColorPicker
                color={visualIdentity.colors.primary}
                onChange={(updates) =>
                  updateColor(visualIdentity.colors.primary.id, updates)
                }
              />
              <ColorPicker
                color={visualIdentity.colors.secondary}
                onChange={(updates) =>
                  updateColor(visualIdentity.colors.secondary.id, updates)
                }
              />
              <ColorPicker
                color={visualIdentity.colors.accent}
                onChange={(updates) =>
                  updateColor(visualIdentity.colors.accent.id, updates)
                }
              />
            </div>
          </div>

          {/* Custom Colors */}
          {visualIdentity.colors.custom.length > 0 && (
            <div className="space-y-4">
              <Label>Custom Colors</Label>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visualIdentity.colors.custom.map((color) => (
                  <ColorPicker
                    key={color.id}
                    color={color}
                    onChange={(updates) => updateColor(color.id, updates)}
                    onRemove={() => removeColor(color.id)}
                    showRemove
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add Color Button */}
          <Button
            variant="outline"
            onClick={handleAddCustomColor}
            className="w-full border-dashed"
            disabled={visualIdentity.colors.custom.length >= 5}
          >
            <Icon name="plus" size="size-4" className="mr-2" />
            Add Custom Color
            {visualIdentity.colors.custom.length >= 5 && (
              <span className="ml-2 text-muted-foreground">(max 5)</span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Typography Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="font" size="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Typography</CardTitle>
              <CardDescription>
                Select font families for headings and body text
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FontSelector
              font={visualIdentity.typography.heading}
              role="heading"
              onChange={(updates) =>
                updateTypography({
                  heading: { ...visualIdentity.typography.heading, ...updates },
                })
              }
            />
            <FontSelector
              font={visualIdentity.typography.body}
              role="body"
              onChange={(updates) =>
                updateTypography({
                  body: { ...visualIdentity.typography.body, ...updates },
                })
              }
            />
          </div>

          {/* Typography Preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Typography Preview
            </p>
            <h3
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: visualIdentity.typography.heading.family }}
            >
              The quick brown fox
            </h3>
            <p
              className="text-base text-muted-foreground leading-relaxed"
              style={{ fontFamily: visualIdentity.typography.body.family }}
            >
              The quick brown fox jumps over the lazy dog. This sample text
              demonstrates how your brand typography will look across different
              content types and sizes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <p className="text-sm text-muted-foreground mr-auto">
          {visualIdentity.updatedAt && (
            <>
              Last saved:{" "}
              {new Date(visualIdentity.updatedAt).toLocaleString()}
            </>
          )}
        </p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
          {isSaving ? "Saving..." : "Save Visual Identity"}
        </Button>
      </div>
    </div>
  )
}
