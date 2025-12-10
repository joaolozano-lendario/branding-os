/**
 * Theme Toggle Component
 * Branding OS - Academia Lendaria
 */

import { cn } from '@/lib/utils'
import { useTheme } from '@/store/themeStore'
import { useTranslation } from '@/store/i18nStore'
import { Button } from './button'
import { Icon } from './icon'

interface ThemeToggleProps {
  className?: string
  variant?: 'button' | 'dropdown' | 'segmented'
}

export function ThemeToggle({ className, variant = 'button' }: ThemeToggleProps) {
  const { theme, setTheme, isDark } = useTheme()
  const { t } = useTranslation()

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn('relative', className)}
        aria-label={isDark ? t.common.lightMode : t.common.darkMode}
      >
        <Icon
          name="sun"
          className={cn(
            'transition-all duration-300',
            isDark ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'
          )}
        />
        <Icon
          name="moon"
          className={cn(
            'absolute transition-all duration-300',
            isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'
          )}
        />
      </Button>
    )
  }

  if (variant === 'segmented') {
    return (
      <div className={cn('flex gap-1 p-1 bg-muted rounded-lg', className)}>
        <ThemeButton
          active={theme === 'light'}
          onClick={() => setTheme('light')}
          icon="sun"
          label={t.common.lightMode}
        />
        <ThemeButton
          active={theme === 'dark'}
          onClick={() => setTheme('dark')}
          icon="moon"
          label={t.common.darkMode}
        />
        <ThemeButton
          active={theme === 'system'}
          onClick={() => setTheme('system')}
          icon="computer"
          label={t.common.systemTheme}
        />
      </div>
    )
  }

  // Dropdown variant (default)
  return (
    <div className={cn('relative group', className)}>
      <Button variant="ghost" size="icon">
        <span className="sr-only">Toggle theme</span>
        <Icon name={isDark ? 'moon' : 'sun'} />
      </Button>
      <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-card border border-border rounded-lg shadow-lg p-2 min-w-[160px]">
          <ThemeOption
            active={theme === 'light'}
            onClick={() => setTheme('light')}
            icon="sun"
            label={t.common.lightMode}
          />
          <ThemeOption
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
            icon="moon"
            label={t.common.darkMode}
          />
          <ThemeOption
            active={theme === 'system'}
            onClick={() => setTheme('system')}
            icon="computer"
            label={t.common.systemTheme}
          />
        </div>
      </div>
    </div>
  )
}

function ThemeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      )}
      aria-label={label}
    >
      <Icon name={icon} size="size-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function ThemeOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-muted'
      )}
    >
      <Icon name={icon} size="size-4" />
      <span>{label}</span>
      {active && <Icon name="check" size="size-4" className="ml-auto" />}
    </button>
  )
}
