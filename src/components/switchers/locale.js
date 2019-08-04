import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";
import CommonStore from 'stores/common-store';
import { localStorage } from "core/storage";
import { ReactComponent as FlagEN } from "parts/images/EN.svg";

const DropdownId = 'LocaleSwitcherDropdown';

@observer
class ResidencyDropdown extends React.Component {
    toggleMenu() {
        if (DropdownId == CommonStore.openDropdown)
            return CommonStore.setOpenDropdown(null);
        CommonStore.setOpenDropdown(DropdownId);
    }

    changeLanguage = (i18n, lng) => {
        i18n.changeLanguage(lng);
        localStorage.set("locale", lng);
        localStorage.set("direction", i18n.dir(lng), 'all');
        window.setPageDirectionFromLS();
    };

    render() {
        const { t, i18n } = useTranslation();

        return (
            <React.Fragment>
                <div class="switcher language-switcher" onClick={this.toggleMenu}>
                    <div class="flag">
                        <FlagEN />
                    </div>
                    <div class="name">{t('current_language_name')}</div>
                    <div class="switch-arrow" />

                    {DropdownId == CommonStore.openDropdown && <div class="locale dropdown">
                        <div class="item" onClick={this.changeLanguage.bind(null, i18n, 'ar')}>
                            <FlagEN />
                            <span>القط</span>
                        </div>
                        <div class="item" onClick={this.changeLanguage.bind(null, i18n, 'en')}>
                            <FlagEN />
                            <span>English</span>
                        </div>
                    </div>}
                </div>
            </React.Fragment>
        );
    }
}

export default ResidencyDropdown;
