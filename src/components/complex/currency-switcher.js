import React from "react";
import { observer } from "mobx-react";

@observer
class CurrencySwitcherDropdown extends React.Component {
    render() {
        return (
            <div class="switcher currency-switcher">
                <div class="currency">USD <span>(US Dollars)</span></div>
            </div>
        );
    }
}

export default CurrencySwitcherDropdown;
