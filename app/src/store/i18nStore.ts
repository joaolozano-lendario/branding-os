/**
 * i18n Store
 * Branding OS - Academia Lendaria
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale, Translation } from '@/i18n/types'
import { getTranslation, defaultLocale } from '@/i18n'

interface I18nState {
  locale: Locale
  t: Translation
  setLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      t: getTranslation(defaultLocale),

      setLocale: (locale: Locale) => {
        set({
          locale,
          t: getTranslation(locale),
        })
      },
    }),
    {
      name: 'branding-os-i18n',
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = getTranslation(state.locale)
        }
      },
    }
  )
)

// Hook for easy access
export function useTranslation() {
  const { t, locale, setLocale } = useI18nStore()
  return { t, locale, setLocale }
}
