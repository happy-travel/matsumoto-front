import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag } from "simple";

import View from "stores/view-store";

const dropdownId = "LocaleSwitcherDropdown";

@observer
class LocaleSwitcherDropdown extends React.Component {
    render() {
        const { t } = useTranslation();

        return (
            <React.Fragment>
                <div class="switcher language-switcher"
                     data-dropdown={dropdownId}
                     onClick={() => View.setOpenDropdown(dropdownId)}>
                    <div class="flag-holder">
                        {t("current_language_name") == "English" ?
                            <Flag code={"gb"} /> :
                            <Flag code={"ae"} />
                        }
                    </div>
                    <div class="name">{t("current_language_name")}</div>
                    <div class="switch-arrow" />

                    {View.isDropdownOpen(dropdownId) && <div class="locale dropdown">
                        <div class="item" onClick={switchLocale.bind(null, "ar")}>
                            <Flag code={"ae"} />
                            <span>اللغة الحالية</span>
                        </div>
                        <div class="item" onClick={switchLocale.bind(null, "en")}>
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
