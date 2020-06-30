import { action } from "mobx";
import { propertyDecorator } from "decorating";

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const setterName = name => "set" + capitalize(name);

export default propertyDecorator((target, prop, desc, name, customValue) => {
    if ( typeof name !== "string") {
        customValue = name;
        name = undefined;
    }

    name = name || setterName(prop);

    const fnDesc = action.bound(target, name, {
        value: function (value) {
            if (customValue !== undefined) {
                value = (typeof customValue === "function")
                    ? customValue.call(this, value)
                    : customValue;
            }

            this[prop] = value;
        }
    });
    Object.defineProperty(target, name, fnDesc);

    return desc && {...desc, configurable: true};
});
