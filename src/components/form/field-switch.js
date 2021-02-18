import React from "react";
import FieldCheckbox from "./field-checkbox";

class FieldSwitch extends FieldCheckbox {
    render() {
        return (
            <>
                <div onClick={this.changing} class={"switch-control" + __class(this.state.value, "active")} />
                { !!this.props.label && <div onClick={this.changing} class="vertical-label">
                    {this.props.label}
                </div> }
            </>
        );
    }
}

export default FieldSwitch;
