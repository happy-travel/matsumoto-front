import { windowSessionStorage } from "core/misc/window-storage";

const STORAGE_KEY = "__user_id",
      DIRECT_PAYMENT_ID = "__direct_payment";

const userAuthGetFromStorage = () => windowSessionStorage.get(STORAGE_KEY);

const userAuthRemoveFromStorage = () => windowSessionStorage.remove(STORAGE_KEY);

const userAuthSetToStorage = (user) => {
    if (!user?.email) {
        if (userAuthGetFromStorage())
            userAuthRemoveFromStorage();
        return;
    }

    var value = btoa(user.email);
    if (value == userAuthGetFromStorage())
        return;

    windowSessionStorage.set(STORAGE_KEY, value);

    if (_renderTheApp)
        _renderTheApp();
};

const userAuthSetDirectPayment = () => {
    if (!userAuthGetFromStorage())
        userAuthSetToStorage(DIRECT_PAYMENT_ID);
};

const Authorized = () =>
    userAuthGetFromStorage() && (DIRECT_PAYMENT_ID != userAuthGetFromStorage());

const PagesAvailableUnauthorized =
    ["/contact", "/terms", "/privacy", "/about", "/signup/", "/pay", "/logout"];

const isPageAvailableAuthorizedOnly = () => PagesAvailableUnauthorized.every(
    item => window.location.href.indexOf(item) == -1
);

export {
    Authorized,

    userAuthGetFromStorage,
    userAuthSetToStorage,
    userAuthRemoveFromStorage,

    userAuthSetDirectPayment,

    isPageAvailableAuthorizedOnly
}
