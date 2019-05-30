import i18n from 'i18next';

i18n.init({
        resources: {
            en: {
                translations: {
                    "Home": "THE HOME",
                    "Sec": "SECOND ITEM",
                    "Wow": "THE MAIN CONTNET"
                }
            },
            it: {
                translations: {
                    "Home": "ПЕРВИТАЛИ",
                    "Sec": "ВТОРИТА",
                    "Wow": "КШНОТЕНТА ОТОЫШ"
                }
            }
        },
        fallbackLng: 'en',
        debug: true,

        // have a common namespace used around the full app
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