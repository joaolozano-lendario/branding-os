/**
 * Settings Page
 * BRAND-021: Settings page for user preferences
 * E5: Fixed i18n, added dropdownPosition
 * E6: Added Gemini API Key configuration
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 inactive, #E8E8E8 border
 */

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useToast } from "@/components/ui/toast"
import { useTranslation } from "@/store/i18nStore"
import { useAuthStore } from "@/store/authStore"
import { useAgentStore } from "@/store/agentStore"
import { GeminiAPIClient } from "@/services/gemini"
import { useNavigate } from "react-router-dom"

export function SettingsPage() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { user, logout } = useAuthStore()
  const { apiConfig, isApiConfigured, setApiKey, clearApiKey } = useAgentStore()
  const navigate = useNavigate()

  const [apiKeyInput, setApiKeyInput] = React.useState("")
  const [isTestingConnection, setIsTestingConnection] = React.useState(false)
  const [showApiKey, setShowApiKey] = React.useState(false)

  React.useEffect(() => {
    if (apiConfig?.apiKey) {
      setApiKeyInput(apiConfig.apiKey)
    }
  }, [apiConfig?.apiKey])

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      addToast("error", t.errors.required)
      return
    }
    setApiKey(apiKeyInput.trim())
    addToast("success", t.common.success)
  }

  const handleTestConnection = async () => {
    if (!apiKeyInput.trim()) {
      addToast("error", t.errors.required)
      return
    }

    setIsTestingConnection(true)
    try {
      const client = new GeminiAPIClient({
        apiKey: apiKeyInput.trim(),
        model: "models/gemini-3-pro-preview",
        temperature: 0.7,
        maxOutputTokens: 4096,
      })

      const connected = await client.testConnection()
      if (connected) {
        addToast("success", t.settings.api.connectionSuccess)
        setApiKey(apiKeyInput.trim())
      } else {
        addToast("error", t.settings.api.connectionError)
      }
    } catch {
      addToast("error", t.settings.api.connectionError)
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleClearApiKey = () => {
    clearApiKey()
    setApiKeyInput("")
    addToast("success", t.common.success)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const maskedApiKey = apiConfig?.apiKey
    ? `${apiConfig.apiKey.slice(0, 8)}...${apiConfig.apiKey.slice(-4)}`
    : ""

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-[32px] font-semibold text-foreground">
            {t.nav.settings}
          </h1>
          <p className="text-base font-medium text-muted-foreground mt-2">
            {t.settings.general.title}
          </p>
        </div>

        {/* API Configuration Section - CRITICAL FOR APP TO WORK */}
        <Card className="border-brand-indigo/30 bg-brand-indigo/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Icon name="key" className="w-[18px] h-[18px] text-brand-indigo" />
              {t.settings.api.title}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">
              {t.settings.api.geminiApiKeyDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background border">
              <div className={`w-2 h-2 rounded-full ${isApiConfigured ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm font-medium">
                {isApiConfigured ? (
                  <>
                    <span className="text-green-600 dark:text-green-400">Configurado</span>
                    <span className="text-muted-foreground ml-2">({maskedApiKey})</span>
                  </>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400">Nao configurado - Configure para usar a geracao de conteudo</span>
                )}
              </span>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {t.settings.api.geminiApiKey}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIza..."
                    className="pr-10 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name={showApiKey ? "eye-closed" : "eye"} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Obtenha sua chave em{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-indigo hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !apiKeyInput.trim()}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                {isTestingConnection ? (
                  <>
                    <Icon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Icon name="plug" className="w-4 h-4 mr-2" />
                    {t.settings.api.testConnection}
                  </>
                )}
              </Button>

              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                className="flex-1 sm:flex-none"
              >
                <Icon name="check" className="w-4 h-4 mr-2" />
                {t.common.save}
              </Button>

              {isApiConfigured && (
                <Button
                  onClick={handleClearApiKey}
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="trash" className="w-4 h-4 mr-2" />
                  {t.common.clear}
                </Button>
              )}
            </div>

            {/* Models Info */}
            <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-1">
              <p className="font-semibold text-foreground">Modelos utilizados:</p>
              <p className="text-muted-foreground font-mono">• gemini-3-pro-preview (texto)</p>
              <p className="text-muted-foreground font-mono">• gemini-3-pro-image-preview (imagens)</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
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
