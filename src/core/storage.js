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
