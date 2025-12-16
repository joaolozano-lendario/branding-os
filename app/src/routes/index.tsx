/**
 * Router Configuration
 * BRAND-017: Setup React Router
 * Defines all application routes with lazy loading for performance optimization
 * PRESENTATION MODE: Auth disabled, redirects to generate wizard
 */

import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import { PublicLayout } from "@/layouts/PublicLayout"
// AuthGuard disabled for presentation
// import { AuthGuard } from "@/components/auth/AuthGuard"

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

// Lazy load public pages for code splitting
const LandingPage = lazy(() => import("@/pages/Landing").then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import("@/pages/Login").then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import("@/pages/Register").then((m) => ({ default: m.RegisterPage })))

// Lazy load protected pages for code splitting
const HomePage = lazy(() => import("@/pages/Home").then((m) => ({ default: m.HomePage })))
const BrandDashboard = lazy(() => import("@/pages/BrandDashboard").then((m) => ({ default: m.BrandDashboard })))
const GenerateWizard = lazy(() => import("@/pages/GenerateWizard").then((m) => ({ default: m.GenerateWizard })))
const GenerateWizardV2 = lazy(() => import("@/pages/GenerateWizardV2").then((m) => ({ default: m.GenerateWizardV2 })))
const AssetLibrary = lazy(() => import("@/pages/AssetLibrary").then((m) => ({ default: m.AssetLibrary })))
const SettingsPage = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.SettingsPage })))

export const router = createBrowserRouter([
  // Root redirect to app (presentation mode)
  {
    path: "/",
    element: <Navigate to="/app/generate-v2" replace />,
  },
  // Public routes (kept for reference, but login/register redirect to app)
  {
    path: "/public",
    element: <PublicLayout />,
    children: [
      {
        path: "landing",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  // App routes - NO AUTH REQUIRED (presentation mode)
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/generate-v2" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "brand",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandDashboard />
          </Suspense>
        ),
      },
      {
        path: "generate",
        element: (
          <Suspense fallback={<PageLoader />}>
            <GenerateWizard />
          </Suspense>
        ),
      },
      {
        path: "generate-v2",
        element: (
          <Suspense fallback={<PageLoader />}>
            <GenerateWizardV2 />
          </Suspense>
        ),
      },
      {
        path: "library",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssetLibrary />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  // Catch-all redirect to app
  {
    path: "*",
    element: <Navigate to="/app/generate-v2" replace />,
  },
])
