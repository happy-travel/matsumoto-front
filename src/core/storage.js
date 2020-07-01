import { userAuthGetFromStorage } from "core/auth";
const googleSessionStorageKey = "google-session";
import { windowLocalStorage, windowSessionStorage } from "core/misc/window-storage";

const userKey = (key) => {
    var userId = userAuthGetFromStorage() || "_no_user_";
    return key + '_' + userId;
};

export const localStorage = {
    set: (key, item) => windowLocalStorage.set(userKey(key), item),
    get: (key) => windowLocalStorage.get(userKey(key)),
    remove: (key) => windowLocalStorage.remove(userKey(key))
};

export const session = {
    set: (key, item) => {
        if (!userAuthGetFromStorage()) return;
        windowSessionStorage.set(userKey(key), item);
    },
    get: (key) => {
        if (!userAuthGetFromStorage()) return;
        return windowSessionStorage.get(userKey(key));
    },
    remove: (key) => {
        if (!userAuthGetFromStorage()) return;
        windowSessionStorage.remove(userKey(key));
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
