import { windowLocalStorage } from "core/misc/window-storage";
import i18n from "i18next";

const WINDOW_LOCAL_STORAGE_KEY = "locale";
const SUPPORTED_LOCALES = ["en", "ar"];

const getLocale = () => {
    if (window.__ht_locale)
        return window.__ht_locale;

    let newLocale = windowLocalStorage.get(WINDOW_LOCAL_STORAGE_KEY);
    if (!SUPPORTED_LOCALES.includes(newLocale))
        newLocale = SUPPORTED_LOCALES[0];

    window.__ht_locale = newLocale;
    return newLocale;
};

const setLocale = (locale) => {
    i18n.changeLanguage(locale);
    window.__ht_locale = locale;
    windowLocalStorage.set(WINDOW_LOCAL_STORAGE_KEY, locale);
    window.setPageDirectionFromLS();
};

export {
    getLocale,
    setLocale
};
