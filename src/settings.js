const dev = {
    EDO_URL      : "https://edo-dev.happytravel.com/",
    IDENTITY_URL : "https://identity-dev.happytravel.com/",
    SENTRY_DSN   : "https://21e4194b435946e0b2e20444d6948d25@sentry.dev.happytravel.com/4",
    OSAKA_URL    : "https://osaka-dev.happytravel.com/",
};

let settings = {
    default_culture       : "en",

    edo_url               : process.env.EDO_URL || dev.EDO_URL,
    edo_v1                : "/api/1.0",

    identity_url          : process.env.IDENTITY_URL || dev.IDENTITY_URL,
    identity_scope        : "edo openid email predictions",
    identity_client_id    : "matsumoto",

    auth_callback_host    : window.location.origin,
    payment_callback_host : window.location.origin,
    payment_any_cb_host   : window.location.origin,

    osaka_url             : process.env.OSAKA_URL || dev.OSAKA_URL,
    osaka_v1              : "api/1.0",

    sentry_dsn            : process.env.SENTRY_DSN || dev.SENTRY_DSN,

    build                 : process.env.BUILD_VERSION || "JS_Default"
};

if (__localhost)
    settings.payment_callback_host = "https://dev.happytravel.com";

settings.edo = (culture) => settings.edo_url + culture + settings.edo_v1;
settings.osaka = settings.osaka_url + settings.osaka_v1;

export default settings;