import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Flag } from "components/simple";
import { useDropdown } from "simple";
import { setLocale } from "core";

const LocaleSwitcherDropdown = observer(() => {
    const { t } = useTranslation();
    const refElement = useRef(null);
    const refDropdown = useRef(null);
    const [dropdownOpen, toggleDropdown] = useDropdown(refElement, refDropdown);

    const selectLocale = (locale) => {
        setLocale(locale);
    };

    return (
        <>
            <div
                className={"switcher" + __class(dropdownOpen, "open")}
                onClick={toggleDropdown}
                ref={refElement}
            >
                <div>
                    <span className="icon icon-locale-switcher" />
                </div>
                <div className="name">{t("current_language_name")}</div>
                <div className="switch-arrow" />
            </div>
            { dropdownOpen &&
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
        </>
    );
});

export default LocaleSwitcherDropdown;
