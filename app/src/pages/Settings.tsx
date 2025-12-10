/**
 * Settings Page
 * BRAND-021: Settings page for user preferences
 * E5: Fixed i18n, added dropdownPosition
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@/components/ui/icon"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useTranslation } from "@/store/i18nStore"
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router-dom"

export function SettingsPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-tight">
            {t.nav.settings}
          </h1>
          <p className="font-serif text-muted-foreground mt-2">
            {t.settings.general.title}
          </p>
        </div>

        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="user" size="size-5" />
              {t.auth.name}
            </CardTitle>
            <CardDescription>
              {t.auth.enterCredentials}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.auth.name}</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.auth.email}</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="palette" size="size-5" />
              {t.common.theme}
            </CardTitle>
            <CardDescription>
              {t.settings.general.themeDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.common.theme}</p>
                <p className="text-sm text-muted-foreground">
                  {t.settings.general.themeDesc}
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.common.language}</p>
                <p className="text-sm text-muted-foreground">
                  {t.settings.general.languageDesc}
                </p>
              </div>
              <LanguageSelector showLabel />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Icon name="warning" size="size-5" />
              {t.common.warning}
            </CardTitle>
            <CardDescription>
              {t.errors.generic}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout}>
              <Icon name="chevron-left" size="size-4" className="mr-2" />
              {t.auth.logout}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
