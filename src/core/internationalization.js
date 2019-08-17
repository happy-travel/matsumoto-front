import i18n from 'i18next';
import { localStorage } from "core/storage";
import settings from "settings";

import english from 'translation/english';
import arabic from 'translation/arabic';

i18n.init({
    lng: localStorage.get("locale") || settings.default_culture,
    resources: {
        en: english,
        ar: arabic
    },
    fallbackLng: "en",
    debug: true,

    ns: ['translations'],
    defaultNS: 'translations',

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