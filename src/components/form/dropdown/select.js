import React from "react";
import { observer } from "mobx-react";
import UI from "stores/ui-store";

@observer
class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
            }
        };
    }

    setValue(connected, item) {
    }

    render() {
        var {
            connected
        } = this.props;

        return (
            <div class="dropdown">
            </div>
        );
    }
}

export default SelectDropdown;
