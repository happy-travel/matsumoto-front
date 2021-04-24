import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag } from "components/simple";
import { setLocale } from "core";
import { $view } from "stores";

const dropdownId = "LocaleSwitcherDropdown";

const LocaleSwitcherDropdown = observer(() => {
    const { t } = useTranslation();

    const selectLocale = (locale) => {
        $view.setOpenDropdown(null);
        setLocale(locale);
    };

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
                    <div className="line" onClick={() => selectLocale("ar")}>
                        <Flag language="ar" />
                        <span>اللغة الحالية</span>
                    </div>
                    <div className="line" onClick={() => selectLocale("en")}>
                        <Flag language="en" />
                        <span>English</span>
                    </div>
                </div>
            }
        </div>
    );
});

export default LocaleSwitcherDropdown;
