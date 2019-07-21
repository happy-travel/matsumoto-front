import i18n from 'i18next';
import english from '../translation/english';
import arabic from '../translation/arabic';

i18n.init({
        resources: {
            en: english,
            ar: arabic
        },
        fallbackLng: 'en',
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