import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import { localStorage } from "core";
import Flag from "components/flag";

const dropdownId = "LocaleSwitcherDropdown";

@observer
class LocaleSwitcherDropdown extends React.Component {
    toggleMenu() {
        if (dropdownId == UI.openDropdown)
            return UI.setOpenDropdown(null);
        UI.setOpenDropdown(dropdownId);
    }

    changeLanguage = (i18n, lng) => {
        i18n.changeLanguage(lng);
        localStorage.set("locale", lng);
        localStorage.set("direction", i18n.dir(lng), "all");
        window.setPageDirectionFromLS();
    };

    render() {
        const { t, i18n } = useTranslation();

        return (
            <React.Fragment>
                <div class="switcher language-switcher" onClick={this.toggleMenu}>
                    <div class="flag-holder">
                        <Flag code={"gb"} />
                    </div>
                    <div class="name">{t("current_language_name")}</div>
                    <div class="switch-arrow" />

                    {dropdownId == UI.openDropdown && <div class="locale dropdown">
                        <div class="item" onClick={this.changeLanguage.bind(null, i18n, "ar")}>
                            <Flag code={"ar"} />
                            <span>القط</span>
                        </div>
                        <div class="item" onClick={this.changeLanguage.bind(null, i18n, "en")}>
                            <Flag code={"gb"} />
                            <span>English</span>
                        </div>
                    </div>}
                </div>
            </React.Fragment>
        );
    }
}

export default LocaleSwitcherDropdown;