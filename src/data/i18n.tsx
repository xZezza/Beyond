import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import translations from './translations.json';
export type Locale = 'en' | 'it';
const LOCALE_KEY = 'oltre.locale.v1';
const dictionary: Record<string, string> = translations;
const I18nContext = createContext({ locale: 'en' as Locale, setLocale: (_locale: Locale) => {}, t: (text: string) => dictionary[text] ?? text });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>('en');
  useEffect(() => {
    try { const saved = localStorage.getItem(LOCALE_KEY); if (saved === 'en' || saved === 'it') updateLocale(saved); } catch { /* Language remains available without storage. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', locale === 'en'
      ? 'OLTRE: a free journey through space discoveries, open questions and books. Explore three destinations and build your own logbook.'
      : 'OLTRE: un viaggio libero tra scoperte dello spazio, domande aperte e libri. Esplora tre destinazioni e costruisci il tuo diario di bordo.');
  }, [locale]);
  function setLocale(next: Locale) {
    updateLocale(next);
    try { localStorage.setItem(LOCALE_KEY, next); } catch { /* Keep this session's choice. */ }
  }
  const t = (text: string) => locale === 'it' ? text : dictionary[text] ?? text;
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}
export const useI18n = () => useContext(I18nContext);
