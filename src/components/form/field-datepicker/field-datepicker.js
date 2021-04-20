import React from "react";
import { FieldText } from "components/form";
import DateDropdown from "./dropdown-datepicker";
import { date } from "simple";

class FieldDatepicker extends React.Component {
    state = {
        text: ""
    };

    generateText = () => {
        const {
            formik,
            first,
            second,
            short
        } = this.props;

        if (formik.values[first] || formik.values[second])
            return (
                date.format[short ? "shortDay" : "c"](formik.values[first])
                + " – " +
                date.format[short ? "shortDay" : "c"](formik.values[second])
            );

        return "";
    };

    setValue = ([from, to]) => {
        const {
            formik,
            first,
            second,
            onChange
        } = this.props;

        formik.setFieldValue(first, from);
        formik.setFieldValue(second, to);
        if (onChange)
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

    componentDidMount() {
        this.setState({
            text: this.generateText()
        });
    }

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
            onChange,
            short
        } = this.props;

        const {
            text
        } = this.state;

        return (
            <FieldText
                noInput={short}
                ValueObject={short ? text : undefined}
                formik={formik}
                id={id}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                Icon={<span className="icon icon-search-calendar"/>}
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
