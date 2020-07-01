import { autorun, set } from "mobx";
import { session } from "../storage";
import settings from "settings";

export default (store, key) => {
    var cached = session.get(key);
    const reserve = JSON.parse(JSON.stringify(store));

    if (cached)
        try {
            var value = JSON.parse(cached);
            if (value.build == settings.build)
                set(store, value);
            else
                set(store, reserve);
        }
        catch (e) {
            set(store, reserve);
        }
    else
        set(store, { build: settings.build }); // hack for autorun keep running over empty store

    autorun(() => {
        cached = session.get(key);
        store.build = settings.build;
        const newValue = JSON.stringify(store);
        if (cached != newValue)
            session.set(key, newValue);
    }, {
        delay: 500
    });
};
