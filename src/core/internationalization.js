import i18n from 'i18next';
import { localStorage } from "core/storage";

import english from 'translation/english';
import arabic from 'translation/arabic';

const default_locale = "en";

i18n.init({
    lng: localStorage.get("locale") || default_locale,
    resources: {
        en: english,
        ar: arabic
    },
    fallbackLng: default_locale,
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