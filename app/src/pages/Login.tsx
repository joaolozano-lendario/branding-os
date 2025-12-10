/**
 * Login Page
 * BRAND-019: Login Flow
 * BRAND-029/030: Enhanced with proper components and error handling
 */

import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Icon name="building" size="size-6" />
          </div>
          <CardTitle className="text-2xl">{t.auth.login}</CardTitle>
          <CardDescription>
            {t.auth.enterCredentials}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                aria-invalid={!!displayError}
                aria-describedby={displayError ? "error-message" : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                disabled={isLoading}
                aria-invalid={!!displayError}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-label={isLoading ? t.common.loading : t.auth.login}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" variant="white" className="mr-2" />
                  {t.common.loading}
                </>
              ) : (
                t.auth.login
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.auth.noAccount}{" "}
              <Link
                to="/register"
                className="text-primary hover:underline"
                tabIndex={isLoading ? -1 : 0}
              >
                {t.auth.register}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
