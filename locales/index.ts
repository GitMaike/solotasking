import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./en";
import pt from "./pt";

const i18n = new I18n({ pt, en });

// Detecta idioma do dispositivo automaticamente
const deviceLocale = getLocales()[0]?.languageCode ?? "pt";
i18n.locale = deviceLocale;
i18n.enableFallback = true;
i18n.defaultLocale = "pt";

export default i18n;
export const t = (key: string, options?: object) => i18n.t(key, options);
