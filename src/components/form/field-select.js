import React from "react";
import { getIn } from "formik";
import { observer } from "mobx-react";
import FieldText from "./field-text";

import View from "stores/view-store";

const getTextByValue = (formik, id, options) => {
    var value = getIn(formik.values, id);

    if (formik && typeof value != "undefined")
        for (var i = 0; i < options.length; i++)
            if (options[i].value == value)
                return <React.Fragment>{options[i].text}</React.Fragment>;

    return null;
};

@observer
class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(item) {
        var { formik, connected } = this.props;
        if (!formik) return;

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
                        <div class="item line" onClick={ () => this.setValue(item) }>
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
        } = this.props,

            ValueObject = getTextByValue(formik, id, options);

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
