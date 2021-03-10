import React from "react";
import { observer } from "mobx-react";

@observer
class CurrencySwitcherDropdown extends React.Component {
    render() {
        return (
            <div className="switcher currency-switcher">
                <div>
                    <span className="icon icon-currency-switcher" />
                </div>
                <div className="currency">USD <span>(US Dollars)</span></div>
            </div>
        );
    }
}

export default CurrencySwitcherDropdown;
