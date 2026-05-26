import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const SUPPORT_LOCALES = ["fr", "en"] as const;
export type SupportedLocale = (typeof SUPPORT_LOCALES)[number];
export const LOCALES_OPTIONS: { code: SupportedLocale; labelKey: string }[] = [
  {
    code: "fr",
    labelKey: "LANGUAGES.FR",
  },
  {
    code: "en",
    labelKey: "LANGUAGES.EN",
  },
];

type MessageSchema = typeof en;

const savedLocale = localStorage.getItem("locale");
const browserLocale = navigator.language.startsWith("fr") ? "fr" : "en";

const locale: SupportedLocale = SUPPORT_LOCALES.includes(savedLocale as SupportedLocale)
  ? (savedLocale as SupportedLocale)
  : browserLocale;

const messages: Record<SupportedLocale, MessageSchema> = {
  fr,
  en,
};

const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  locale,
  fallbackLocale: "en",
  messages,
});

export default i18n;
