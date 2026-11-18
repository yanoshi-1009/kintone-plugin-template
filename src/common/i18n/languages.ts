import en from "./locales/en";
import ja from "./locales/ja";
import zh from "./locales/zh";

export const resources = {
  en: { translation: en },
  ja: { translation: ja },
  zh: { translation: zh }
};

export type SupportedLanguage = keyof typeof resources;

export const FALLBACK_LANGUAGE = "en" satisfies SupportedLanguage;

const isSupported = (value: string): value is SupportedLanguage =>
  Object.hasOwn(resources, value);

export const resolveLanguage = (rawLanguage: string): SupportedLanguage => {
  if (isSupported(rawLanguage)) return rawLanguage;

  const [base] = rawLanguage.split("-");
  if (base && isSupported(base)) return base;

  return FALLBACK_LANGUAGE;
};
