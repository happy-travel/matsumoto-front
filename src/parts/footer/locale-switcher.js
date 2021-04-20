import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag } from "components/simple";
import { switchLocale } from "core/misc/switch-locale";
import { $view } from "stores";

const dropdownId = "LocaleSwitcherDropdown";

@observer
class LocaleSwitcherDropdown extends React.Component {
    render() {
        const { t, i18n } = useTranslation();

        return (
            <div
                className={"switcher" + __class($view.isDropdownOpen(dropdownId), "open")}
                data-dropdown={dropdownId}
                onClick={() => $view.setOpenDropdown(dropdownId)}
            >
                <div>
                    <span className="icon icon-locale-switcher" />
                </div>
                <div className="name">{t("current_language_name")}</div>
                <div className="switch-arrow" />

                { $view.isDropdownOpen(dropdownId) &&
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
