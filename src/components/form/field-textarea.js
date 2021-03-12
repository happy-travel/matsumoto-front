import React from "react";
import {getIn} from "formik";
import FieldText from "./field-text"
import { observer } from "mobx-react";

@observer
class FieldTextarea extends FieldText {
    constructor(props) {
        super(props);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onKeyUp(event) {
        event.target.style.height = "1px";
        event.target.style.height = ( event.target.scrollHeight + 20 )+"px";
    }

    render() {
        var {
            label,
            placeholder,
            className,
            id,
            formik,
            required,
            disabled,
        } = this.props;
        const errorText = getIn(formik?.errors, id);
        const isFieldTouched = getIn(formik?.touched, id);

        return (
            <div className={"field" + __class(className)}>
                <label>
                    { label && <div className={
                        "label" +
                        __class(this.state.focus, "focus") +
                        __class(disabled, "disabled")
                    }>
                        <span className={__class(required, "required")}>{label}</span>
                    </div> }
                    <div className={"input textarea" +
                        __class(this.state.focus, "focus") +
                        __class((errorText && isFieldTouched), "error") +
                        __class(disabled, "disabled")}
                    >
                        { !disabled ? <div className="inner">
                            <textarea
                                id={id}
                                placeholder={ placeholder }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                onKeyUp={ this.onKeyUp }
                            >
                                {getIn(formik?.values, id)}
                            </textarea>
                        </div> : getIn(formik?.values, id) }
                    </div>
                    {(errorText && isFieldTouched) ?
                        <div className="error-holder">{errorText}</div>
                    : null}
                </label>
            </div>
        );
    }
}

export default FieldTextarea;
