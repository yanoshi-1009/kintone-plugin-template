import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/zh";
import i18next from "i18next";
import { FALLBACK_LANGUAGE, resolveLanguage, resources } from "./languages";

const language = resolveLanguage(kintone.getLoginUser().language);

i18next.init(
  {
    lng: language,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: Object.keys(resources),
    resources
  },
  (error: unknown) => {
    if (error) console.error("I18next initialization failed", error);
  }
);

dayjs.locale(language);

export const t = i18next.t;
export { i18next as i18n };

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: typeof resources.en;
  }
}
