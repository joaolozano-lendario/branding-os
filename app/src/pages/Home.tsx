/**
 * Home Page
 * BRAND-XXX: Dashboard Home Page
 * Main dashboard for authenticated users
 * FIGMA SPECS: Uses semantic CSS variables for theme support
 */

import { Link } from "react-router-dom"
import { Icon } from "@/components/ui/icon"
import { InfinitoSeparator } from "@/components/ui/logo-academia"
import { useTranslation } from "@/store/i18nStore"
import { useBrandStore } from "@/store/brandStore"

export function HomePage() {
  const { t } = useTranslation()
  const { config, calculateCompleteness } = useBrandStore()
  const completeness = calculateCompleteness()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] font-semibold text-foreground">
                {t.nav.dashboard}
              </h1>
              <p className="text-base font-medium text-muted-foreground">
                {t.brand.subtitle}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Brand Completeness Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                <Icon name="apps" className="w-[18px] h-[18px] text-brand-indigo" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{t.brand.completeness}</h3>
                <p className="text-xs font-medium text-muted-foreground">{config.name}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.brand.completeProfile}</span>
                <span className="font-semibold text-foreground">{completeness.overall}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-brand-indigo transition-all"
                  style={{ width: `${completeness.overall}%` }}
                />
              </div>

              {/* Section Progress */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.nav.visualIdentity}</span>
                  <span className="font-medium text-foreground">{completeness.visualIdentity}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.nav.brandVoice}</span>
                  <span className="font-medium text-foreground">{completeness.voice}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.nav.examples}</span>
                  <span className="font-medium text-foreground">{completeness.examples}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 rounded-lg border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">{t.brand.title}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Generate Card */}
              <Link
                to="/app/generate-v2"
                className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 text-center transition-colors hover:border-brand-indigo/50 hover:bg-secondary"
              >
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                  <Icon name="bolt" className="w-[18px] h-[18px] text-brand-indigo" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{t.nav.generate}</h4>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.dashboard.aiPowered}
                </p>
              </Link>

              {/* Brand Config Card */}
              <Link
                to="/app/brand"
                className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 text-center transition-colors hover:border-brand-indigo/50 hover:bg-secondary"
              >
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                  <Icon name="palette" className="w-[18px] h-[18px] text-brand-indigo" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{t.nav.brandConfig}</h4>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.brand.visual.title}
                </p>
              </Link>

              {/* Library Card */}
              <Link
                to="/app/library"
                className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 text-center transition-colors hover:border-brand-indigo/50 hover:bg-secondary"
              >
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                  <Icon name="picture" className="w-[18px] h-[18px] text-brand-indigo" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{t.nav.examples}</h4>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.brand.examples.title}
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Separador decorativo */}
        <InfinitoSeparator className="my-8 max-w-md mx-auto" />

        {/* Getting Started Tips */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">{t.dashboard.gettingStarted}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-indigo/10">
                <span className="text-xs font-semibold text-brand-indigo">1</span>
              </div>
              <span className="text-muted-foreground">{t.dashboard.steps.step1}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-indigo/10">
                <span className="text-xs font-semibold text-brand-indigo">2</span>
              </div>
              <span className="text-muted-foreground">{t.dashboard.steps.step2}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-indigo/10">
                <span className="text-xs font-semibold text-brand-indigo">3</span>
              </div>
              <span className="text-muted-foreground">{t.dashboard.steps.step3}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-indigo/10">
                <span className="text-xs font-semibold text-brand-indigo">4</span>
              </div>
              <span className="text-muted-foreground">{t.dashboard.steps.step4}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
