import i18n from "i18next";
import { windowLocalStorage } from "core/misc/window-storage";
import settings from "settings";

import english from "translation/english";
import arabic from "translation/arabic";

i18n.init({
    lng: windowLocalStorage.get("locale") || settings.default_culture,
    resources: {
        en: english,
        ar: arabic
    },
    fallbackLng: "en",
    debug: __localhost,

    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: true,

    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },

    react: {
        wait: true
    }
});

export default i18n;
