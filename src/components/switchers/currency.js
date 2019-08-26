import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import { localStorage } from "core";

const dropdownId = "CurrencySwitcherDropdown";

@observer
class CurrencySwitcherDropdown extends React.Component {
    toggleMenu() {
        if (dropdownId == UI.openDropdown)
            return UI.setOpenDropdown(null);
        UI.setOpenDropdown(dropdownId);
    }

    changeCurrency = (value) => {
        //todo: finish the component
    };

    render() {
        const { t, i18n } = useTranslation();

        return (
            <React.Fragment>
                <div class="switcher currency-switcher" onClick={this.toggleMenu}>
                    <div class="currency">USD <span>(US Dollars)</span></div>
                    { /* <div class="switch-arrow" />
                    {dropdownId == UI.openDropdown && <div class="currency dropdown">
                        <div class="item" onClick={this.changeCurrency.bind(null, "")}>
                            USD
                        </div>
                        <div class="item" onClick={this.changeCurrency.bind(null, "")}>
                            EUR
                        </div>
                    </div>}*/ }
                </div>
            </React.Fragment>
        );
    }
}

export default CurrencySwitcherDropdown;
