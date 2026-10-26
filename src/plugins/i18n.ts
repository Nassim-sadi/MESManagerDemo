import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export type AppLocale = 'en' | 'ar'

const LOCALE_KEY = 'mes.lang'

function persistedLocale(): AppLocale {
  return localStorage.getItem(LOCALE_KEY) === 'ar' ? 'ar' : 'en'
}

/** Pure read for main.ts - no i18n instance dependency, runs pre-mount. */
export function persistedLocaleInitial(): AppLocale {
  return persistedLocale()
}

/**
 * BCP47 tag for `Intl.*` calls: Arabic gets Latin digits (ar-u-nu-latn)
 * so quantities stay readable on the shop floor; dates localize fully.
 */
export function intlLocale(): string {
  return i18n.global.locale.value === 'ar' ? 'ar-u-nu-latn' : 'en-GB'
}

export function isRtl(): boolean {
  return i18n.global.locale.value === 'ar'
}

export function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale

  document.documentElement.lang = locale
  document.documentElement.dir = isRtl() ? 'rtl' : 'ltr'
  localStorage.setItem(LOCALE_KEY, locale)
}

export const i18n = createI18n({
  legacy: false,
  locale: persistedLocale(),
  fallbackLocale: 'en',
  messages: { en, ar },
})
