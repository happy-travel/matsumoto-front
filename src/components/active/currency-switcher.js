import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";

@observer
class CurrencySwitcherDropdown extends React.Component {
    render() {
        const { t, i18n } = useTranslation();
        return (
            <React.Fragment>
                <div class="switcher currency-switcher">
                    <div class="currency">USD <span>(US Dollars)</span></div>
                </div>
            </React.Fragment>
        );
    }
}

export default CurrencySwitcherDropdown;
