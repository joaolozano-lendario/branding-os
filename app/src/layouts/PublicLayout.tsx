/**
 * PublicLayout
 * BRAND-017: Public pages layout (landing, login, register)
 */

import { Outlet } from "react-router-dom"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSelector } from "@/components/ui/language-selector"

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for public pages */}
      <header className="fixed top-0 right-0 z-50 p-4 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </header>

      {/* Page content */}
      <Outlet />
    </div>
  )
}
