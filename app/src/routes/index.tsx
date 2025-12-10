/**
 * Router Configuration
 * BRAND-017: Setup React Router
 * Defines all application routes
 */

import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import { PublicLayout } from "@/layouts/PublicLayout"
import { AuthGuard } from "@/components/auth/AuthGuard"

// Public pages
import { LandingPage } from "@/pages/Landing"
import { LoginPage } from "@/pages/Login"
import { RegisterPage } from "@/pages/Register"

// Protected pages
import { BrandDashboard } from "@/pages/BrandDashboard"
import { GenerateWizard } from "@/pages/GenerateWizard"
import { AssetLibrary } from "@/pages/AssetLibrary"
import { SettingsPage } from "@/pages/Settings"

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  // Protected app routes
  {
    path: "/app",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/brand" replace />,
      },
      {
        path: "brand",
        element: <BrandDashboard />,
      },
      {
        path: "generate",
        element: <GenerateWizard />,
      },
      {
        path: "library",
        element: <AssetLibrary />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
