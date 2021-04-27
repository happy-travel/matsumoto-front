import { windowSessionStorage } from "core/misc/window-storage";

const STORAGE_KEY = "__auth_id",
      DIRECT_PAYMENT_ID = "__direct_payment";

const authGetFromStorage = () => windowSessionStorage.get(STORAGE_KEY);

const authRemoveFromStorage = () => windowSessionStorage.remove(STORAGE_KEY);

const authSetToStorage = (auth) => {
    const email = auth?.email || auth?.profile?.email;
    if (!email) {
        if (authGetFromStorage())
            authRemoveFromStorage();
        return;
    }

    const value = btoa(email);
    if (value == authGetFromStorage())
        return;

    windowSessionStorage.set(STORAGE_KEY, value);

    if (_renderTheApp)
        _renderTheApp();
};

const authSetDirectPayment = () => {
    if (!authGetFromStorage())
        windowSessionStorage.set(STORAGE_KEY, DIRECT_PAYMENT_ID);
};

const Authorized = () =>
    authGetFromStorage() && (DIRECT_PAYMENT_ID != authGetFromStorage());

const PagesAvailableUnauthorized = [
    "/contact", "/terms", "/signup/invite/", "/privacy", "/about", "/logout",
    "/pay/", "/pay/confirmation", "/payment/result", "/payments/callback"
];

const isSignUpRoutes = () => window.location.href.indexOf("/signup/") > -1;

const isPageAvailableAuthorizedOnly = () => PagesAvailableUnauthorized.every(
    item => !window.location.href.includes(item)
);

export {
    Authorized,

    authGetFromStorage,
    authSetToStorage,
    authRemoveFromStorage,

    authSetDirectPayment,

    isSignUpRoutes,
    isPageAvailableAuthorizedOnly
}
