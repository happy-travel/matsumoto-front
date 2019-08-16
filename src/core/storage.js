import UserStore from 'stores/user-store';

const userKey = (key, everyUser) => {
    var userId = UserStore.id;

    if (!userId || everyUser)
        return key;

    return userId + '_' + key;
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
        var result = false;
        try {
            window.sessionStorage.setItem("availability_check", "okay");
            if ("okay" == window.sessionStorage.getItem("availability_check"))
                result = true;
            window.sessionStorage.removeItem("availability_check");
        } catch (e) {
        }
        if (!result) {
            if (window && !window._session)
                window._session = {};
        }
        return result;
    },
    set: (key, item) => {
        if (session.isAvailable())
            window.sessionStorage.setItem(key, item);
        else
            window._session[key] = item;
    },
    get: (key) => {
        if (session.isAvailable())
            return window.sessionStorage.getItem(key);
        return window._session[key];
    },
    remove: (key) => {
        if (session.isAvailable())
            window.sessionStorage.removeItem(key);
        else
            window._session[key] = null;
    }
};
