import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { localStorage } from "core";
import { windowLocalStorage } from "core/misc/window-storage";
import { Flag } from "simple";

import View from "stores/ui-store";

const dropdownId = "LocaleSwitcherDropdown";

@observer
class LocaleSwitcherDropdown extends React.Component {
    changeLanguage(i18n, lng) {
        i18n.changeLanguage(lng);
        localStorage.set("locale", lng);
        windowLocalStorage.set("direction", i18n.dir(lng));
        window.setPageDirectionFromLS();
    };

    render() {
        const { t, i18n } = useTranslation();

        return (
            <React.Fragment>
                <div class="switcher language-switcher"
                     data-dropdown="close"
                     onClick={() => View.setOpenDropdown(dropdownId)}>
                    <div class="flag-holder">
                        {t("current_language_name") == "English" ?
                            <Flag code={"gb"} /> :
                            <Flag code={"ae"} />
                        }
                    </div>
                    <div class="name">{t("current_language_name")}</div>
                    <div class="switch-arrow" />

                    {dropdownId == View.openDropdown && <div class="locale dropdown">
                        <div class="item" onClick={this.changeLanguage.bind(null, i18n, "ar")}>
                            <Flag code={"ae"} />
                            <span>اللغة الحالية</span>
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
