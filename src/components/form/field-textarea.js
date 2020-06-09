import React from "react";
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
            addClass,
            id,
            formik,
            required,
            disabled,
        } = this.props;

        return (
            <div class={"field" + __class(addClass)}>
                <label>
                    { label && <div class="label">
                        <span class={__class(required, "required")}>{label}</span>
                    </div> }
                    <div class={"input textarea" +
                        __class(this.state.focus, "focus") +
                        __class((formik?.errors[id] && formik?.touched[id]), "error") +
                        __class(disabled, "disabled")}
                    >
                        { !disabled ? <div class="inner">
                            <textarea
                                id={id}
                                placeholder={ placeholder }
                                onFocus={ this.onFocus }
                                onChange={ this.changing }
                                onBlur={ this.onBlur }
                                onKeyUp={ this.onKeyUp }
                            />
                        </div> : formik?.values[id] }
                    </div>
                    {(formik?.errors[id]?.length && formik?.touched[id]) ?
                        <div class="error-holder">{formik.errors[id]}</div>
                    : null}
                </label>
            </div>
        );
    }
}

export default FieldTextarea;
