import React from 'react';
import { observer } from "mobx-react";
import FieldText from "./field-text";
import Dropdown from "./dropdown/select";

@observer
class FieldSelect extends React.Component {
    render() {
        var {
            formik,
            id
        } = this.props;

        return (
            <FieldText
                {...this.props}
                Icon={<span class="icon icon-arrow-expand"/>}
                addClass="select"
                Dropdown={Dropdown}
                value={(formik && formik.values && formik.values["_" + id]) || null}
                readonly
            />
        );
    }
}

export default FieldSelect;
