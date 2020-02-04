import { autorun, set, toJS } from "mobx";
import { session } from "../storage";

export default (store, key) => {
    var initial = true;

    autorun(() => {
        if (initial) {
            const cached = session.get(key),
                  reserve = JSON.parse(JSON.stringify(toJS(store)));

            if (cached)
                try {
                    var value = JSON.parse(cached);
                    set(store, value);
                }
                catch (e) {
                    set(store, reserve);
                }
        }
        session.set(key, JSON.stringify(toJS(store)));
    });

    initial = false;
};
