import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DateDropdown from "./dropdown-datepicker";
import { dateFormat } from "simple";

@observer
class FieldCountry extends React.Component {
    render() {
        const {
            formik,
            id,
            label,
            placeholder,
            first,
            second,

            onChange = () => {}
        } = this.props;

        return (
            <FieldText formik={formik}
                       id={id}
                       label={label}
                       placeholder={placeholder}
                       Icon={<span class="icon icon-calendar"/>}
                       addClass="size-medium"
                       Dropdown={DateDropdown}
                       value={
                           (formik.values[first] || formik.values[second]) ?
                               (
                                   dateFormat.b(formik.values[first])
                                   + " – " +
                                   dateFormat.b(formik.values[second])
                               ) : ''
                       }
                       setValue={range => {
                           formik.setFieldValue(first, range.start);
                           formik.setFieldValue(second, range.end);
                           onChange();
                       }}
                       options={moment.range(
                           moment(formik.values[first]),
                           moment(formik.values[second])
                       )}
            />
        );
    }
}

export default FieldCountry;