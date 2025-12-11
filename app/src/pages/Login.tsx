/**
 * Login Page
 * BRAND-019: Login Flow
 * BRAND-029/030: Enhanced with proper components and error handling
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 inactive, #E8E8E8 border
 */

import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "@/store/i18nStore"
import { useAuthStore } from "@/store/authStore"

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error: storeError, clearError } = useAuthStore()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [localError, setLocalError] = React.useState("")

  const from = location.state?.from?.pathname || "/app"

  // Clear errors when inputs change
  React.useEffect(() => {
    if (localError) setLocalError("")
    if (storeError) clearError()
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password) {
      setLocalError(t.auth.enterCredentials)
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const displayError = localError || storeError

  return (
    // Figma: bg #FFFFFF
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-background">
      {/* Figma: Card with border #E8E8E8, radius 8px */}
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Figma: 42x42 icon container, radius full */}
          <div className="mx-auto mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo">
            <Icon name="building" className="w-[18px] h-[18px] text-white" />
          </div>
          {/* Figma: Inter SemiBold 32px */}
          <h1 className="text-[32px] font-semibold text-foreground">{t.auth.login}</h1>
          {/* Figma: Inter Medium 16px, #888888 */}
          <p className="text-base font-medium text-muted-foreground mt-2">
            {t.auth.enterCredentials}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {displayError && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
              <Icon name="warning" className="w-[18px] h-[18px] text-red-500" />
              <p className="text-sm font-medium text-red-600">{displayError}</p>
            </div>
          )}

          {/* Email Input - Figma: h-[62px], border #E8E8E8, radius 8px */}
          <div className="space-y-2">
            {/* Figma: Inter SemiBold 12px */}
            <label htmlFor="email" className="text-xs font-semibold text-foreground">
              {t.auth.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              aria-invalid={!!displayError}
              className="w-full h-[62px] px-4 rounded-lg border border-border bg-background text-base font-medium text-foreground placeholder:text-[#C8C8C8] focus:outline-none focus:border-[#5856D6] disabled:opacity-50"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold text-foreground">
              {t.auth.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              disabled={isLoading}
              aria-invalid={!!displayError}
              className="w-full h-[62px] px-4 rounded-lg border border-border bg-background text-base font-medium text-foreground placeholder:text-[#C8C8C8] focus:outline-none focus:border-[#5856D6] disabled:opacity-50"
            />
          </div>

          {/* Submit Button - Figma: h-[41px], radius full, bg #5856D6 */}
          <button
            type="submit"
            disabled={isLoading}
            aria-label={isLoading ? t.common.loading : t.auth.login}
            className="w-full h-[41px] rounded-full bg-brand-indigo text-sm font-semibold text-white hover:bg-brand-indigo/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" variant="white" />
                {t.common.loading}
              </>
            ) : (
              t.auth.login
            )}
          </button>

          {/* Register Link - Figma: Inter Medium 12px, #888888 */}
          <p className="text-center text-xs font-medium text-muted-foreground">
            {t.auth.noAccount}{" "}
            <Link
              to="/register"
              className="text-brand-indigo hover:underline font-semibold"
              tabIndex={isLoading ? -1 : 0}
            >
              {t.auth.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
