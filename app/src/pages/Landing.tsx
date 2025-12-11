/**
 * Landing Page
 * BRAND-018: Homepage/Landing Page
 * Public landing page for unauthenticated users
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 cards, #E8E8E8 border
 */

import { Link } from "react-router-dom"
import { Icon } from "@/components/ui/icon"
import { useTranslation } from "@/store/i18nStore"

export function LandingPage() {
  const { t } = useTranslation()

  return (
    // Figma: bg #FFFFFF
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Logo - Figma: 42x42 icon container, radius full */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-indigo">
              <Icon name="building" className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Headline - Figma: Inter SemiBold 32px */}
          <div className="space-y-4">
            <h1 className="text-[32px] font-semibold text-foreground">
              {t.brand.title}
            </h1>
            {/* Figma: Inter Medium 16px, #888888 */}
            <p className="mx-auto max-w-xl text-base font-medium text-muted-foreground">
              {t.brand.subtitle}
            </p>
          </div>

          {/* CTA Buttons - Figma: pill buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {/* Figma: Primary button - bg #5856D6, h-[41px], radius full */}
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 h-[41px] px-[18px] rounded-full bg-brand-indigo text-sm font-semibold text-white hover:bg-brand-indigo/90 transition-colors"
            >
              {t.auth.register}
              <Icon name="angle-right" className="w-[14px] h-[14px]" />
            </Link>
            {/* Figma: Secondary button - bg #F8F8F8, border #E8E8E8 */}
            <Link
              to="/login"
              className="inline-flex items-center justify-center h-[41px] px-[18px] rounded-full bg-secondary border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              {t.auth.login}
            </Link>
          </div>

          {/* Features preview - Figma: cards 194x280, gap 8px, radius 8px */}
          <div className="grid gap-6 pt-12 sm:grid-cols-3">
            {/* Visual Identity Card */}
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-secondary p-6">
              {/* Figma: 42x42 icon container */}
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                <Icon name="palette" className="w-[18px] h-[18px] text-brand-indigo" />
              </div>
              {/* Figma: Inter SemiBold 16px */}
              <h3 className="text-base font-semibold text-foreground">{t.brand.visual.title}</h3>
              {/* Figma: Inter Medium 12px, #888888 */}
              <p className="text-xs font-medium text-muted-foreground">
                {t.brand.visual.logo}, {t.brand.visual.colors}, {t.brand.visual.typography}
              </p>
            </div>
            
            {/* Voice Card */}
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-secondary p-6">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                <Icon name="comment" className="w-[18px] h-[18px] text-brand-indigo" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{t.brand.voice.title}</h3>
              <p className="text-xs font-medium text-muted-foreground">
                {t.brand.voice.attributes}
              </p>
            </div>
            
            {/* Generate Card */}
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-secondary p-6">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo/10">
                <Icon name="lightning" className="w-[18px] h-[18px] text-brand-indigo" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{t.nav.generate}</h3>
              <p className="text-xs font-medium text-muted-foreground">
                AI-powered content generation
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Figma: border #E8E8E8 */}
      <footer className="border-t border-border py-6 text-center">
        {/* Figma: Inter Medium 12px, #888888 */}
        <p className="text-xs font-medium text-muted-foreground">Branding OS - Academia Lendaria</p>
      </footer>
    </div>
  )
}
