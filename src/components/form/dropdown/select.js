import React from "react";
import { observer } from "mobx-react";
import CommonStore from "stores/common-store";

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
        const store = CommonStore;

        return (
            <div class="dropdown">
            </div>
        );
    }
}

export default SelectDropdown;
