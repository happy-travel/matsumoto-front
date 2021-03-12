import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DateDropdown from "./dropdown-datepicker";
import { date } from "simple";

@observer
class FieldDatepicker extends React.Component {
    generateText = () => {
        const {
            formik,
            first,
            second
        } = this.props;

        if (formik.values[first] || formik.values[second])
            return (
                date.format.c(formik.values[first])
                + " – " +
                date.format.c(formik.values[second])
            );

        return "";
    };

    state = {
        text: this.generateText()
    };

    setValue = ([from, to]) => {
        const {
            formik,
            first,
            second,
            onChange = () => {}
        } = this.props;

        formik.setFieldValue(first, from);
        formik.setFieldValue(second, to);
        onChange();
    };

    inputChanged = (event) => {
        var currentValue = event.target.value
            .replace(/[^0-9.,\/\- –]/g, "");
        this.setState({
            text: currentValue,
        });
        const parseResult = date.parseDateRangeFromString(currentValue);
        if (parseResult)
            this.setValue(parseResult);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            formik, first, second
        } = this.props;
        if (
            prevProps.formik.values[first] === formik.values[first] &&
            prevProps.formik.values[second] === formik.values[second]
        )
            return;

        this.setState({
            text: this.generateText()
        });
    }

    render() {
        const {
            formik,
            disabled,
            id,
            label,
            placeholder,
            first,
            second,
            onChange
        } = this.props;
        const {
            text
        } = this.state;

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
                onChange={this.inputChanged}
                value={text}
                setValue={this.setValue}
                options={[
                    new Date(formik.values[first]),
                    new Date(formik.values[second])
                ]}
            />
        );
    }
}

export default FieldDatepicker;
