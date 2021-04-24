import { windowLocalStorage } from "core/misc/window-storage";
import i18n from "i18next";
import settings from "settings";

const WINDOW_LOCAL_STORAGE_KEY = "locale";

const getLocale = () => {
    if (window.__ht_locale)
        return window.__ht_locale;

    const result = windowLocalStorage.get(WINDOW_LOCAL_STORAGE_KEY) || settings.default_culture;
    window.__ht_locale = result;
    return result;
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
