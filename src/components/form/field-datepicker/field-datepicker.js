import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DateDropdown from "./dropdown-datepicker";
import { date } from "simple";

@observer
class FieldDatepicker extends React.Component {
    render() {
        const {
            formik,
            disabled,
            id,
            label,
            placeholder,
            first,
            second,

            onChange = () => {}
        } = this.props;

        return (
            <FieldText
                formik={formik}
                id={id}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                Icon={<span className="icon icon-calendar"/>}
                className="size-medium"
                Dropdown={DateDropdown}
                value={
                    (formik.values[first] || formik.values[second]) ?
                        (
                            date.format.c(formik.values[first])
                            + " – " +
                            date.format.c(formik.values[second])
                        ) : ''
                }
                setValue={([from, to]) => {
                    formik.setFieldValue(first, from);
                    formik.setFieldValue(second, to);
                    onChange();
                }}
                options={[
                    new Date(formik.values[first]),
                    new Date(formik.values[second])
                ]}
            />
        );
    }
}

export default FieldDatepicker;
