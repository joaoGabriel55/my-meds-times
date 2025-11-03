import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';
import it from '../locales/it.json';
import de from '../locales/de.json';
import nl from '../locales/nl.json';
import fr from '../locales/fr.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';
import ar from '../locales/ar.json';
import ru from '../locales/ru.json';
import he from '../locales/he.json';

const LANGUAGE_STORAGE_KEY = "@app_language";

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
  it: { translation: it },
  de: { translation: de },
  nl: { translation: nl },
  fr: { translation: fr },
  ja: { translation: ja },
  zh: { translation: zh },
  ar: { translation: ar },
  ru: { translation: ru },
  he: { translation: he },
} as const;

// RTL languages
const RTL_LANGUAGES = ["ar", "he"];

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  // If no saved language, try to use device locale
  if (!savedLanguage) {
    const deviceLocale = getLocales()[0]?.languageCode || "en";
    // Check if we support this language, otherwise default to English
    savedLanguage = resources[deviceLocale as keyof typeof resources]
      ? deviceLocale
      : "en";
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
};

export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
};

export const getCurrentLanguage = () => i18n.language;

export const isRTL = (language?: string) => {
  const lang = language || i18n.language;
  return RTL_LANGUAGES.includes(lang);
};

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Deutsch' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'he', name: 'עברית' },
];

initI18n();

export default i18n;
