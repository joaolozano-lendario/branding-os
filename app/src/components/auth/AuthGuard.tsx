/**
 * AuthGuard
 * BRAND-017: Route protection component
 * Redirects unauthenticated users to login
 */

import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
