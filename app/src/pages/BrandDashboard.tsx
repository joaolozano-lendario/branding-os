/**
 * BrandDashboard Page
 * BRAND-004: Brand Configuration Dashboard
 * BRAND-016: i18n integration fix
 * Main dashboard for brand configuration overview
 * Academia Lendária Design System
 */

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompletenessIndicator, CompletenessBreakdown } from "@/components/brand/CompletenessIndicator"
import { ExportButton } from "@/components/brand/ExportButton"
import { ColorPalettePreview } from "@/components/brand/ColorPicker"
import { VisualIdentityForm } from "@/components/brand/VisualIdentityForm"
import { VoiceAttributesSelector } from "@/components/brand/VoiceAttributesSelector"
import { ToneGuidelinesEditor } from "@/components/brand/ToneGuidelinesEditor"
import { CopyExamplesManager } from "@/components/brand/CopyExamplesManager"
import { ExampleUploader } from "@/components/brand/ExampleUploader"
import { ExampleGallery } from "@/components/brand/ExampleGallery"
import {
  useBrandStore,
  selectVisualIdentity,
  selectVoice,
  selectExamples,
  selectActiveSection,
} from "@/store/brandStore"
import { useTranslation } from "@/store/i18nStore"
import type { ConfigSection } from "@/types/brand"

export function BrandDashboard() {
  const { t, locale } = useTranslation()
  const visualIdentity = useBrandStore(selectVisualIdentity)
  const voice = useBrandStore(selectVoice)
  const examples = useBrandStore(selectExamples)
  const activeSection = useBrandStore(selectActiveSection)
  const {
    config,
    setActiveSection,
    toggleVoiceAttribute,
    addToneGuideline,
    updateToneGuideline,
    removeToneGuideline,
    addCopyExample,
    removeCopyExample,
    addExample,
    removeExample,
    calculateCompleteness,
  } = useBrandStore()

  const completeness = calculateCompleteness()

  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    const localeMap: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
      "pt-br": "pt-BR",
    }
    return new Date(date).toLocaleDateString(localeMap[locale] || "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // All colors for preview
  const allColors = [
    visualIdentity.colors.primary,
    visualIdentity.colors.secondary,
    visualIdentity.colors.accent,
    ...visualIdentity.colors.custom,
  ]

  // Example counts by type
  const exampleCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    examples.examples.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1
    })
    return counts
  }, [examples.examples])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              {visualIdentity.logo.url ? (
                <img
                  src={visualIdentity.logo.url}
                  alt={t.brand.visual.logo}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name="building" size="size-5" />
                </div>
              )}
              <div>
                <h1 className="font-sans text-xl font-bold tracking-tight truncate max-w-[200px]" title={config.name}>
                  {config.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t.nav.brandConfig}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
                            <ExportButton config={config} />
              <Button onClick={() => setActiveSection("visual")}>
                <Icon name="pencil" size="size-4" className="mr-2" />
                {t.common.edit}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs
          value={activeSection}
          onValueChange={(v) => setActiveSection(v as ConfigSection)}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">
              <Icon name="apps" size="size-4" className="mr-2" />
              {t.nav.dashboard}
            </TabsTrigger>
            <TabsTrigger value="visual">
              <Icon name="palette" size="size-4" className="mr-2" />
              {t.nav.visualIdentity}
            </TabsTrigger>
            <TabsTrigger value="voice">
              <Icon name="comment" size="size-4" className="mr-2" />
              {t.nav.brandVoice}
            </TabsTrigger>
            <TabsTrigger value="examples">
              <Icon name="picture" size="size-4" className="mr-2" />
              {t.nav.examples}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Completeness Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Overall Progress */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">{t.brand.completeness}</CardTitle>
                  <CardDescription>
                    {t.brand.completeProfile}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-4">
                  <CompletenessIndicator
                    value={completeness.overall}
                    size="lg"
                    label={t.brand.completeness}
                  />
                  <Separator className="my-6" />
                  <CompletenessBreakdown
                    sections={[
                      { label: t.nav.visualIdentity, value: completeness.visualIdentity },
                      { label: t.nav.brandVoice, value: completeness.voice },
                      { label: t.nav.examples, value: completeness.examples },
                    ]}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">{t.brand.title}</CardTitle>
                  <CardDescription>
                    {t.brand.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  {/* Visual Identity Card */}
                  <button
                    onClick={() => setActiveSection("visual")}
                    className="flex flex-col items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name="palette" size="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.brand.visual.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.brand.visual.logo}, {t.brand.visual.colors}
                      </p>
                    </div>
                    <Badge variant={completeness.visualIdentity >= 80 ? "success" : "outline"}>
                      {completeness.visualIdentity}%
                    </Badge>
                  </button>

                  {/* Voice Card */}
                  <button
                    onClick={() => setActiveSection("voice")}
                    className="flex flex-col items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name="comment" size="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.brand.voice.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.brand.voice.attributes}
                      </p>
                    </div>
                    <Badge variant={completeness.voice >= 80 ? "success" : "outline"}>
                      {completeness.voice}%
                    </Badge>
                  </button>

                  {/* Examples Card */}
                  <button
                    onClick={() => setActiveSection("examples")}
                    className="flex flex-col items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name="picture" size="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.brand.examples.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {examples.examples.length} {t.common.upload}
                      </p>
                    </div>
                    <Badge variant={completeness.examples >= 80 ? "success" : "outline"}>
                      {completeness.examples}%
                    </Badge>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Color Palette Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{t.brand.visual.colors}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSection("visual")}
                    >
                      {t.common.edit}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ColorPalettePreview colors={allColors} className="h-10" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {allColors.length} {t.brand.visual.colors.toLowerCase()}
                  </p>
                </CardContent>
              </Card>

              {/* Typography Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{t.brand.visual.typography}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSection("visual")}
                    >
                      {t.common.edit}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t.brand.visual.headingFont}</span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: visualIdentity.typography.heading.family }}
                    >
                      {visualIdentity.typography.heading.family}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t.brand.visual.bodyFont}</span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: visualIdentity.typography.body.family }}
                    >
                      {visualIdentity.typography.body.family}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{t.brand.voice.attributes}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSection("voice")}
                    >
                      {t.common.edit}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {voice.attributes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {voice.attributes.map((attr) => (
                        <Badge key={attr} variant="secondary" size="sm">
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t.brand.voice.attributesHelp}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Last Updated */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.common.save}</span>
                  <span>{formatDate(config.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visual Identity Tab */}
          <TabsContent value="visual">
            <VisualIdentityForm />
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent value="voice" className="space-y-8">
            <div>
              <h2 className="font-sans text-2xl font-bold tracking-tight">
                {t.brand.voice.title}
              </h2>
              <p className="font-serif text-muted-foreground mt-1">
                {t.brand.voice.subtitle}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <VoiceAttributesSelector
                selected={voice.attributes}
                onChange={toggleVoiceAttribute}
              />
              <div className="space-y-8">
                <ToneGuidelinesEditor
                  guidelines={voice.toneGuidelines}
                  onAdd={addToneGuideline}
                  onUpdate={updateToneGuideline}
                  onRemove={removeToneGuideline}
                />
                <CopyExamplesManager
                  examples={voice.copyExamples}
                  onAdd={addCopyExample}
                  onRemove={removeCopyExample}
                />
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight">
                  {t.brand.examples.title}
                </h2>
                <p className="font-serif text-muted-foreground mt-1">
                  {t.brand.examples.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {Object.entries(exampleCounts).map(([type, count]) => (
                  <Badge key={type} variant="outline">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.brand.examples.uploadExamples}</CardTitle>
                <CardDescription>
                  {t.brand.examples.dragDropFiles}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExampleUploader onUpload={addExample} />
              </CardContent>
            </Card>

            <ExampleGallery
              examples={examples.examples}
              onDelete={removeExample}
              emptyMessage={t.brand.examples.noExamples}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
