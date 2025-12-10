/**
 * Language Selector Component
 * Branding OS - Academia Lendaria
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/store/i18nStore'
import { localeNames, type Locale } from '@/i18n'
import { Button } from './button'
import { Icon } from './icon'

interface LanguageSelectorProps {
  className?: string
  variant?: 'button' | 'dropdown' | 'segmented'
  showLabel?: boolean
  dropdownPosition?: 'top' | 'bottom'
}

const localeFlags: Record<Locale, string> = {
  en: 'US',
  es: 'ES',
  'pt-br': 'BR',
}

export function LanguageSelector({
  className,
  variant = 'dropdown',
  showLabel = false,
  dropdownPosition = 'bottom',
}: LanguageSelectorProps) {
  const { locale, setLocale, t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({})

  const locales: Locale[] = ['en', 'es', 'pt-br']

  // Calculate dropdown position based on viewport bounds (fixes BUG-001)
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = 200
      const viewportHeight = window.innerHeight

      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      const shouldOpenUp = dropdownPosition === 'top' || (spaceBelow < dropdownHeight && spaceAbove > spaceBelow)

      if (shouldOpenUp) {
        setDropdownStyle({
          position: 'fixed',
          bottom: viewportHeight - rect.top + 8,
          left: rect.left,
        })
      } else {
        setDropdownStyle({
          position: 'fixed',
          top: rect.bottom + 8,
          left: rect.left,
        })
      }
    }
  }, [isOpen, dropdownPosition])

  if (variant === 'segmented') {
    return (
      <div className={cn('flex gap-1 p-1 bg-muted rounded-lg', className)}>
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              locale === loc
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="text-xs font-bold">{localeFlags[loc]}</span>
            <span className="hidden sm:inline">{localeNames[loc]}</span>
          </button>
        ))}
      </div>
    )
  }

  // Dropdown variant - uses fixed positioning to stay in viewport
  return (
    <div className={cn('relative', className)}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size={showLabel ? 'default' : 'icon'}
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Icon name="globe" size="size-5" />
        {showLabel && (
          <>
            <span className="text-sm">{localeNames[locale]}</span>
            <Icon
              name="angle-small-down"
              size="size-4"
              className={cn(
                'transition-transform duration-200',
                isOpen && (dropdownPosition === 'top' ? '-rotate-180' : 'rotate-180')
              )}
            />
          </>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="z-50" style={dropdownStyle}>
            <div className="bg-card border border-border rounded-lg shadow-lg p-2 min-w-[180px]">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t.common.language}
              </div>
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    locale === loc
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <span className="w-6 text-xs font-bold text-center">
                    {localeFlags[loc]}
                  </span>
                  <span>{localeNames[loc]}</span>
                  {locale === loc && (
                    <Icon name="check" size="size-4" className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
