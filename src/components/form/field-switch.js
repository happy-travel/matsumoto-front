import React from "react";
import FieldCheckbox from "./field-checkbox";

class FieldSwitch extends FieldCheckbox {
    render() {
        return (
            <>
                <div onClick={this.changing} className={"switch-control" + __class(this.state.value, "active")} />
                { !!this.props.label && <div onClick={this.changing} className="vertical-label">
                    {this.props.label}
                </div> }
            </>
        );
    }
}

export default FieldSwitch;
