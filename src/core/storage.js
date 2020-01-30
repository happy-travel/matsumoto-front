export const StorageUserIdKey = "_user_id";

const googleSessionStorageKey = "google-session";

const getUserHashFromStore = () => window.localStorage.getItem(StorageUserIdKey);

const userKey = (key, everyUser) => {
    var userId = getUserHashFromStore();

    if (!userId || everyUser)
        return key;

    return key + '_' + userId;
};

export const localStorage = {
    set: (key, item, everyUser) => {
        try {
            window.localStorage.setItem(userKey(key, everyUser), item)
        } catch (e) {
        }
    },
    get: (key, everyUser) => {
        var result = null;
        try {
            result = window.localStorage.getItem(userKey(key, everyUser));
        } catch (e) {
        }
        return result;
    }
};

export const session = {
    isAvailable: () => {
        if (window._session_available !== undefined)
            return window._session_available;
        var result = false,
            key = "availability_check",
            test_result = Math.trunc(10000 * Math.random());
        try {
            window.sessionStorage.setItem(key, test_result);
            if (test_result == window.sessionStorage.getItem(key))
                result = true;
            window.sessionStorage.removeItem(key);
        } catch (e) {
        }
        if (!result) {
            if (window && !window._session)
                window._session = {};
        }
        window._session_available = result;
        return result;
    },
    set: (key, item) => {
        if (!getUserHashFromStore()) return;

        if (session.isAvailable())
            window.sessionStorage.setItem(userKey(key), item);
        else
            window._session[key] = item;
    },
    get: (key) => {
        if (!getUserHashFromStore()) return;

        if (session.isAvailable())
            return window.sessionStorage.getItem(userKey(key));
        return window._session[key];
    },
    remove: (key) => {
        if (!getUserHashFromStore()) return;

        if (session.isAvailable())
            window.sessionStorage.removeItem(userKey(key));
        else
            window._session[key] = null;
    },
    google: {
        create: () => {
            var result = session.get(googleSessionStorageKey);
            if (!result) {
                result = require('uuid/v4')();
                session.set(googleSessionStorageKey, result);
            }
            return result;
        },
        current: () => session.get(googleSessionStorageKey),
        clear:   () => session.remove(googleSessionStorageKey)
    }
};
