import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', dir: 'ltr' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
] as const;

export type SupportedLanguage = typeof LANGUAGES[number]['code'];

const savedLang = (localStorage.getItem('cyber_lang') as SupportedLanguage) || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      te: { translation: te },
      es: { translation: es },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const setAppLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('cyber_lang', lang);
  const found = LANGUAGES.find((l) => l.code === lang);
  const dir = found?.dir || 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

// Initial dir setup
const initialLangConfig = LANGUAGES.find((l) => l.code === savedLang);
document.documentElement.dir = initialLangConfig?.dir || 'ltr';
document.documentElement.lang = savedLang;

export default i18n;
