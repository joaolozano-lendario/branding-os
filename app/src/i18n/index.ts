/**
 * i18n Index
 * Branding OS - Academia Lendaria
 */

export * from './types'
export { en } from './en'
export { es } from './es'
export { ptBr } from './pt-br'

import type { Locale, Translation } from './types'
import { en } from './en'
import { es } from './es'
import { ptBr } from './pt-br'

export const translations: Record<Locale, Translation> = {
  en,
  es,
  'pt-br': ptBr,
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Espanol',
  'pt-br': 'Portugues (Brasil)',
}

export const defaultLocale: Locale = 'en'

export function getTranslation(locale: Locale): Translation {
  return translations[locale] ?? translations[defaultLocale]
}
