import { autorun, set, toJS } from "mobx";
import { session } from "../storage";

export default (store, key) => {
    var initial = true;

    autorun(() => {
        // return;
        if (initial) { // todo: don't load when it's not needed
            const cached = JSON.parse(session.get(key));
            if (cached)
                set(store, cached);
        }
        session.set(key, JSON.stringify(toJS(store)));
    });

    initial = false;
};
