/**
 * Register Page
 * BRAND-019: Register Flow
 * BRAND-029/030: Enhanced with proper components and error handling
 */

import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "@/store/i18nStore"
import { useAuthStore } from "@/store/authStore"

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register, isLoading, error: storeError, clearError } = useAuthStore()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [localError, setLocalError] = React.useState("")

  // Clear errors when inputs change
  React.useEffect(() => {
    if (localError) setLocalError("")
    if (storeError) clearError()
  }, [name, email, password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!name || !email || !password) {
      setLocalError(t.auth.enterCredentials)
      return
    }

    if (password !== confirmPassword) {
      setLocalError(t.auth.passwordMismatch)
      return
    }

    if (password.length < 6) {
      setLocalError(t.auth.passwordMinLength)
      return
    }

    const success = await register(email, password, name)
    if (success) {
      navigate("/app", { replace: true })
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
          <CardTitle className="text-2xl">{t.auth.register}</CardTitle>
          <CardDescription>
            {t.auth.createAccount}
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
              <Label htmlFor="name">{t.auth.name}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
                aria-invalid={!!displayError}
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                disabled={isLoading}
                aria-invalid={!!displayError}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-label={isLoading ? t.common.loading : t.auth.register}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" variant="white" className="mr-2" />
                  {t.common.loading}
                </>
              ) : (
                t.auth.register
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.auth.hasAccount}{" "}
              <Link
                to="/login"
                className="text-primary hover:underline"
                tabIndex={isLoading ? -1 : 0}
              >
                {t.auth.login}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
