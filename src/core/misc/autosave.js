import { autorun, set, toJS } from "mobx";
import { session } from "../storage";
import settings from "settings";

export default (store, key) => {
    var initial = true;

    autorun(() => {
        if (initial) {
            const cached = session.get(key),
                  reserve = JSON.parse(JSON.stringify(toJS(store)));

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
        session.set(key, JSON.stringify(toJS(store)));
    });

    initial = false;
};
