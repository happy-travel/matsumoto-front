import { action } from "mobx";
import { propertyDecorator } from "decorating";

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const setterName = name => "set" + capitalize(name);

export default propertyDecorator((target, prop, desc, name, defaultValue) => {
    if ( typeof name !== "string") {
        defaultValue = name;
        name = undefined;
    }

    name = name || setterName(prop);

    const fnDesc = action.bound(target, name, {
        value: function (value) {
            if (value === undefined && defaultValue !== undefined)
                this[prop] = defaultValue;
            else
                this[prop] = value;
        }
    });
    Object.defineProperty(target, name, fnDesc);

    return desc && {...desc, configurable: true};
});
