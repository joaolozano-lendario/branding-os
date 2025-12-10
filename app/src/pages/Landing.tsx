/**
 * Landing Page
 * BRAND-018: Homepage/Landing Page
 * Public landing page for unauthenticated users
 */

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useTranslation } from "@/store/i18nStore"

export function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Icon name="building" size="size-8" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.brand.title}
            </h1>
            <p className="mx-auto max-w-xl font-serif text-lg text-muted-foreground sm:text-xl">
              {t.brand.subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-base">
              <Link to="/register">
                {t.auth.register}
                <Icon name="chevron-right" size="size-4" className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/login">
                {t.auth.login}
              </Link>
            </Button>
          </div>

          {/* Features preview */}
          <div className="grid gap-6 pt-12 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="palette" size="size-6" />
              </div>
              <h3 className="font-semibold">{t.brand.visual.title}</h3>
              <p className="text-sm text-muted-foreground">
                {t.brand.visual.logo}, {t.brand.visual.colors}, {t.brand.visual.typography}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="comment" size="size-6" />
              </div>
              <h3 className="font-semibold">{t.brand.voice.title}</h3>
              <p className="text-sm text-muted-foreground">
                {t.brand.voice.attributes}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="lightning" size="size-6" />
              </div>
              <h3 className="font-semibold">{t.nav.generate}</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered content generation
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>Branding OS - Academia Lendária</p>
      </footer>
    </div>
  )
}
