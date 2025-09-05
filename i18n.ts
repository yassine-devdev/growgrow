import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load translation files using fetch and top-level await, which is more compatible
// than import assertions in some environments.
const [enTranslation, esTranslation, frTranslation, arTranslation] = await Promise.all([
    fetch('/locales/en/translation.json').then(res => res.json()),
    fetch('/locales/es/translation.json').then(res => res.json()),
    fetch('/locales/fr/translation.json').then(res => res.json()),
    fetch('/locales/ar/translation.json').then(res => res.json()),
]);


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      ar: {
        translation: arTranslation,
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;