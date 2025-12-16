/**
 * AppLayout
 * BRAND-020: App layout with top navigation bar
 * Main application shell - NO AUTH REQUIRED (presentation mode)
 * RESPONSIVE: Mobile dropdown + desktop horizontal nav
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 inactive, #E8E8E8 border
 * LOGO: Academia Lendaria official SVG (Diamante + Infinito)
 */

import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { Icon } from "@/components/ui/icon"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSelector } from "@/components/ui/language-selector"
import { LogoDiamante, LogoInfinito } from "@/components/ui/logo-academia"
import { useTranslation } from "@/store/i18nStore"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/app/dashboard", icon: "apps", labelKey: "dashboard" },
  { path: "/app/brand", icon: "palette", labelKey: "brandConfig" },
  { path: "/app/generate-v2", icon: "bolt", labelKey: "generate" },
  { path: "/app/library", icon: "picture", labelKey: "examples" },
  { path: "/app/settings", icon: "settings", labelKey: "settings" },
] as const

export function AppLayout() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left: Logo Diamante + Nome */}
          <div className="flex items-center gap-3">
            <LogoDiamante size={38} className="text-foreground" />
            <span className="text-base font-semibold text-foreground">
              Branding OS
            </span>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-3 h-[38px] transition-colors text-sm font-semibold",
                    isActive
                      ? "bg-brand-indigo/10 text-brand-indigo"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      name={item.icon as "apps" | "palette" | "bolt" | "picture" | "settings"}
                      className={cn(
                        "w-[16px] h-[16px]",
                        isActive ? "text-brand-indigo" : "text-muted-foreground"
                      )}
                    />
                    <span className="leading-none">
                      {t.nav[item.labelKey as keyof typeof t.nav]}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Infinito sutil + Language + Theme (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <LogoInfinito size={14} className="text-muted-foreground/40" />
            <div className="flex items-center gap-2">
              <LanguageSelector dropdownPosition="bottom" />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: Hamburger button */}
          <button
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-secondary border border-border md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <Icon
              name={mobileMenuOpen ? "cross" : "menu"}
              className="w-[18px] h-[18px] text-muted-foreground"
            />
          </button>
        </div>

        {/* Mobile: Dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 h-[41px] transition-colors",
                      isActive
                        ? "bg-brand-indigo/10 text-brand-indigo"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        name={item.icon as "apps" | "palette" | "bolt" | "picture" | "settings"}
                        className={cn(
                          "w-[18px] h-[18px]",
                          isActive ? "text-brand-indigo" : "text-muted-foreground"
                        )}
                      />
                      <span className="text-sm font-semibold">
                        {t.nav[item.labelKey as keyof typeof t.nav]}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            {/* Mobile: Language + Theme + Infinito como assinatura */}
            <div className="flex items-center justify-between border-t border-border p-4">
              <div className="flex items-center gap-2">
                <LanguageSelector dropdownPosition="top" />
                <ThemeToggle />
              </div>
              <LogoInfinito size={16} className="text-muted-foreground/30" />
            </div>
          </div>
        )}
      </header>

      {/* Main content - Full width now */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
