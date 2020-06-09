import React from 'react';
import FieldCheckbox from "./field-checkbox";

class FieldSwitch extends FieldCheckbox {
    render() {
        return (
            <div onClick={this.changing}>
                <div class={"switch-control" + __class(this.state.value, "active")} />
            </div>
        );
    }
}

export default FieldSwitch;
