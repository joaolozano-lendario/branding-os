/**
 * Settings Page
 * BRAND-021: Settings page for user preferences
 * E5: Fixed i18n, added dropdownPosition
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 inactive, #E8E8E8 border
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    // Figma: bg #FFFFFF
    <div className="p-8 bg-background min-h-screen">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          {/* Figma: Inter SemiBold 32px */}
          <h1 className="text-[32px] font-semibold text-foreground">
            {t.nav.settings}
          </h1>
          {/* Figma: Inter Medium 16px, #888888 */}
          <p className="text-base font-medium text-muted-foreground mt-2">
            {t.settings.general.title}
          </p>
        </div>

        {/* Account Section - Figma: Card with border #E8E8E8 */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Icon name="user" className="w-[18px] h-[18px] text-brand-indigo" />
              {t.auth.name}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">
              {t.auth.enterCredentials}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{t.auth.name}</span>
                  <span className="text-sm font-semibold text-foreground">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{t.auth.email}</span>
                  <span className="text-sm font-semibold text-foreground">{user.email}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Icon name="palette" className="w-[18px] h-[18px] text-brand-indigo" />
              {t.common.theme}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">
              {t.settings.general.themeDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{t.common.theme}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.settings.general.themeDesc}
                </p>
              </div>
              <ThemeToggle />
            </div>
            <div className="h-px bg-[#E8E8E8]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{t.common.language}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.settings.general.languageDesc}
                </p>
              </div>
              <LanguageSelector showLabel />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-red-500">
              <Icon name="warning" className="w-[18px] h-[18px]" />
              {t.common.warning}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">
              {t.errors.generic}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Figma: Destructive button - pill style */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 h-[41px] px-[18px] rounded-full bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              <Icon name="angle-left" className="w-[14px] h-[14px]" />
              {t.auth.logout}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
