import React from "react";
import { getIn } from "formik";
import { observer } from "mobx-react";
import { Flag } from "simple";
import FieldText from "./field-text";

import View from "stores/view-store";

const getTextByValue = (formik, id, options) => {
    var value = getIn(formik?.values, id);

    if (formik && typeof value != "undefined")
        for (var i = 0; i < options.length; i++)
            if (options[i].value == value)
                return options[i].text;

    return null;
};

@observer
class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(item) {
        var { formik, connected, setValue } = this.props;
        if (setValue)
            setValue(item.value);
        if (formik)
            formik.setFieldValue(connected, item.value);
        View.setOpenDropdown(null);
    }

    render() {
        var {
            options
        } = this.props;

        return (
            <div class="dropdown select">
                <div class="scroll">
                    {options?.map(item => (
                        <div class="item line" onClick={() => this.setValue(item)}>
                            {item.flag && <Flag code={item.flag} /> }
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

@observer
class FieldSelect extends React.Component {
    render() {
        var {
            formik,
            id,
            options,
            addClass,
            value,
            setValue
        } = this.props,

            ValueObject = value || getTextByValue(formik, id, options);

        return (
            <FieldText
                {...this.props}
                Icon={<span class="icon icon-arrow-expand"/>}
                addClass={`select ${addClass}`}
                Dropdown={SelectDropdown}
                ValueObject={ValueObject}
                readonly
            />
        );
    }
}

export default FieldSelect;
