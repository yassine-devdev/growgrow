import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation JSON from the source tree so Vite bundles them and there
// are no runtime fetch 404s that break JSON.parse in the browser.
import enTranslation from "./src/locales/en/translation.json";
import esTranslation from "./src/locales/es/translation.json";
import frTranslation from "./src/locales/fr/translation.json";
import arTranslation from "./src/locales/ar/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
    ar: { translation: arTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
