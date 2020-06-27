export const windowLocalStorage = {
    set: (key, item) => {
        try {
            window.localStorage.setItem(key, item);
        } catch (e) {
        }
    },
    get: (key) => {
        var result = null;
        try {
            result = window.localStorage.getItem(key);
        } catch (e) {
        }
        return result;
    }
};

const checkWindowSessionAvailability = () => {
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
    return result;
};

export const windowSessionStorage = {
    isAvailable: checkWindowSessionAvailability(),
    set: (key, item) => {
        if (windowSessionStorage.isAvailable)
            window.sessionStorage.setItem(key, item);
        else
            window._session[key] = item;
    },
    get: (key) => {
        if (windowSessionStorage.isAvailable)
            return window.sessionStorage.getItem(key);
        return window._session[key];
    },
    remove: (key) => {
        if (windowSessionStorage.isAvailable)
            window.sessionStorage.removeItem(key);
        else
            window._session[key] = null;
    }
};
