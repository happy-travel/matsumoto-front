import i18n from 'i18next';
import { localStorage } from "core";
import settings from "settings";

import english from "translation/english";
import arabic from "translation/arabic";

i18n.init({
    lng: localStorage.get("locale") || settings.default_culture,
    resources: {
        en: english,
        ar: arabic
    },
    fallbackLng: "en",
    debug: "localhost" == window.location.hostname,

    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: '.',

    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },

    react: {
        wait: true
    }
});

export default i18n;
