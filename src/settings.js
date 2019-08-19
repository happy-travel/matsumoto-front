let settings = {
    default_culture       : "en",

    edo_url               : "https://edo-api.dev.happytravel.com/",
    edo_v1                : "/api/1.0",

    sentryDSN             : "https://21e4194b435946e0b2e20444d6948d25@sentry.dev.happytravel.com/4"
};

settings.edo = (culture) => settings.edo_url + culture + settings.edo_v1;

export default settings;