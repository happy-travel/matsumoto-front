import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag } from "simple";
import { switchLocale } from "core/misc/switch-locale";

import View from "stores/view-store";

const dropdownId = "LocaleSwitcherDropdown";

@observer
class LocaleSwitcherDropdown extends React.Component {
    render() {
        const { t, i18n } = useTranslation();

        return (
            <div
                className="switcher language-switcher"
                data-dropdown={dropdownId}
                onClick={() => View.setOpenDropdown(dropdownId)}
            >
                <div className="flag-holder">
                    <Flag language={i18n.language} />
                </div>
                <div className="name">{t("current_language_name")}</div>
                <div className="switch-arrow" />

                { View.isDropdownOpen(dropdownId) &&
                    <div className="locale dropdown">
                        <div className="item" onClick={switchLocale.bind(null, "ar")}>
                            <Flag language="ar" />
                            <span>اللغة الحالية</span>
                        </div>
                        <div className="item" onClick={switchLocale.bind(null, "en")}>
                            <Flag language="en" />
                            <span>English</span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default LocaleSwitcherDropdown;
