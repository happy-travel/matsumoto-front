import { autorun, set, toJS } from "mobx";
import { session } from "../storage";

export default (store, key) => {
    var initial = true;

    autorun(() => {
        if (initial) {
            const cached = session.get(key);
            if (cached)
                set(store, JSON.parse(cached));
        }
        session.set(key, JSON.stringify(toJS(store)));
    });

    initial = false;
};
