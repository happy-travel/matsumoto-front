import React from "react";
import { observer } from "mobx-react";
import FieldText from "./field-text";
import UI from "stores/ui-store";

const getTextByValue = (formik, id, options) => {
    if (formik && typeof formik.values[id] != "undefined")
        for (var i = 0; i < options.length; i++)
            if (options[i].value == formik.values[id])
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
        UI.setOpenDropdown(null);
    }

    render() {
        var {
            options
        } = this.props;

        return (
            <div class="dropdown select">
                {options?.map(item => (
                    <div class="item line" onClick={ () => this.setValue(item) }>
                        {item.text}
                    </div>
                ))}
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
            options
        } = this.props,

            ValueObject = getTextByValue(formik, id, options);

        return (
            <FieldText
                {...this.props}
                Icon={<span class="icon icon-arrow-expand"/>}
                addClass="select"
                Dropdown={SelectDropdown}
                ValueObject={ValueObject}
                readonly
            />
        );
    }
}

export default FieldSelect;
