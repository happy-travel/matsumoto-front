import { autorun, set } from "mobx";
import { session } from "../storage";
import settings from "settings";

export default (store, key) => {
    var initial = true;

    autorun(() => {
        const cached = session.get(key);
        if (initial) {
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
        }
        store.build = settings.build;
        const newValue = JSON.stringify(store);
        if (cached != newValue)
            session.set(key, newValue);
    });

    initial = false;
};
