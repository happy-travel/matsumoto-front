import React from "react";
import { observer } from "mobx-react";
import UI from "stores/ui-store";

@observer
class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(item) {
        var { formik, connected } = this.props;
        if (!formik)
            return;

        formik.setFieldValue(connected, item.value);
        formik.setFieldValue("_" + connected, item.text);
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

export default SelectDropdown;
