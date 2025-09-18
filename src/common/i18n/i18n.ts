import i18next from "i18next";
import en from "./lang/en.json";
import ja from "./lang/ja.json";
import zh from "./lang/zh.json";

i18next.init({
  lng: kintone.getLoginUser().language,
  fallbackLng: "en",
  resources: {
    ja: { translation: ja },
    en: { translation: en },
    zh: { translation: zh }
  }
});

export default i18next;
