/**
 * AppLayout
 * BRAND-020: Protected app layout with sidebar
 * Main application shell for authenticated users
 * RESPONSIVE: Mobile drawer + desktop sidebar
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 inactive, #E8E8E8 border
 */

import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { Icon } from "@/components/ui/icon"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useTranslation } from "@/store/i18nStore"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/app/dashboard", icon: "apps", labelKey: "dashboard" },
  { path: "/app/brand", icon: "palette", labelKey: "brandConfig" },
  { path: "/app/generate-v2", icon: "lightning", labelKey: "generate" },
  { path: "/app/library", icon: "picture", labelKey: "examples" },
  { path: "/app/settings", icon: "settings", labelKey: "settings" },
] as const

export function AppLayout() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    // Figma: bg #FFFFFF
    <div className="flex min-h-screen bg-background">
      {/* Mobile hamburger button - Figma: 42x42 icon container */}
      <button
        className="fixed left-4 top-4 z-50 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-secondary border border-border md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-[18px] h-[18px] text-muted-foreground" />
      </button>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop (fixed) + Mobile (drawer) */}
      {/* Figma: bg white, border #E8E8E8 */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-background transition-transform duration-300",
          // Desktop: always visible
          "md:translate-x-0",
          // Mobile: drawer that slides in
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary md:hidden"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          <Icon name="cross" className="w-[14px] h-[14px] text-muted-foreground" />
        </button>

        {/* Logo - Figma: 42x42 icon container, radius full */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-indigo">
            <Icon name="building" className="w-[18px] h-[18px] text-white" />
          </div>
          {/* Figma: Inter SemiBold 16px */}
          <span className="text-base font-semibold text-foreground">
            Branding OS
          </span>
        </div>

        {/* Navigation - Figma: gap 6px */}
        <nav className="flex flex-col gap-1.5 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                cn(
                  // Figma: radius 8px, h-[41px] like buttons
                  "flex items-center gap-3 rounded-lg px-3 h-[41px] transition-colors",
                  isActive
                    // Figma: active = bg #5856D6/10, text #5856D6
                    ? "bg-brand-indigo/10 text-brand-indigo"
                    // Figma: inactive = text #888888
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={item.icon as "apps" | "palette" | "lightning" | "picture" | "settings"}
                    className={cn(
                      "w-[18px] h-[18px]",
                      isActive ? "text-brand-indigo" : "text-muted-foreground"
                    )}
                  />
                  {/* Figma: Inter SemiBold 14px */}
                  <span className="text-sm font-semibold">
                    {t.nav[item.labelKey as keyof typeof t.nav]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <LanguageSelector dropdownPosition="top" />
            <ThemeToggle />
          </div>
          {/* Figma: Voltar button - pill style */}
          <button
            onClick={() => window.location.href = "/"}
            className="flex w-full items-center justify-center gap-2 h-[41px] rounded-full bg-secondary border border-border hover:bg-secondary transition-colors"
          >
            <Icon name="angle-left" className="w-[14px] h-[14px] text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">{t.common.back}</span>
          </button>
        </div>
      </aside>

      {/* Main content - Responsive margin */}
      <main className="ml-0 flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  )
}
