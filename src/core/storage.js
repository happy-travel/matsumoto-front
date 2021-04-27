import { authGetFromStorage } from "core/auth";
const googleSessionStorageKey = "google-session";
import { windowLocalStorage, windowSessionStorage } from "core/misc/window-storage";

const authKey = (key) => {
    return key + '_' + authGetFromStorage() || "_no_auth_";
};

export const localStorage = {
    set: (key, item) => windowLocalStorage.set(authKey(key), item),
    get: (key) => windowLocalStorage.get(authKey(key)),
    remove: (key) => windowLocalStorage.remove(authKey(key))
};

export const session = {
    set: (key, item) => {
        if (!authGetFromStorage()) return;
        windowSessionStorage.set(authKey(key), item);
    },
    get: (key) => {
        if (!authGetFromStorage()) return;
        return windowSessionStorage.get(authKey(key));
    },
    remove: (key) => {
        if (!authGetFromStorage()) return;
        windowSessionStorage.remove(authKey(key));
    },
    google: {
        create: () => {
            let result = session.get(googleSessionStorageKey);
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
