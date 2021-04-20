import {observer} from "mobx-react";
import React from "react";
import { Flag } from "components/simple";
import { $view } from "stores";

@observer
class FieldSelectDropdown extends React.Component {
    setValue = (item) => {
        var { formik, connected, setValue } = this.props;
        if (setValue)
            setValue(item.value);
        if (formik)
            formik.setFieldValue(connected, item.value);
        $view.setOpenDropdown(null);
    };

    render() {
        var {
            options
        } = this.props;

        return (
            <div className="select dropdown">
                <div className="scroll">
                    {options?.map((item, index) => (
                        <div
                            className="item line"
                            onClick={() => this.setValue(item)}
                            key={index}
                        >
                            {item.flag && <Flag code={item.flag} /> }
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default FieldSelectDropdown;
