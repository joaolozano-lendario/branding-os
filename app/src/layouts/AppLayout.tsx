/**
 * AppLayout
 * BRAND-020: Protected app layout with sidebar
 * Main application shell for authenticated users
 */

import { Outlet, NavLink } from "react-router-dom"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useTranslation } from "@/store/i18nStore"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/app/brand", icon: "palette", labelKey: "brandConfig" },
  { path: "/app/generate", icon: "lightning", labelKey: "generate" },
  { path: "/app/library", icon: "picture", labelKey: "examples" },
  { path: "/app/settings", icon: "settings", labelKey: "settings" },
] as const

export function AppLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon name="building" size="size-4" />
          </div>
          <span className="font-sans text-lg font-bold tracking-tight">
            Branding OS
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Icon name={item.icon as "palette" | "lightning" | "picture" | "settings"} size="size-4" />
              {t.nav[item.labelKey as keyof typeof t.nav]}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="flex items-center justify-between">
            <LanguageSelector dropdownPosition="top" />
            <ThemeToggle />
          </div>
          <Separator className="my-4" />
          <Button variant="outline" className="w-full" onClick={() => window.location.href = "/"}>
            <Icon name="chevron-left" size="size-4" className="mr-2" />
            {t.common.back}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
