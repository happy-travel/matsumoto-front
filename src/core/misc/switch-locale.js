import i18n from "i18next";
import { windowLocalStorage } from "core/misc/window-storage";
import { $view } from "stores";

export const switchLocale = lng => {
    $view.setOpenDropdown(null);
    i18n.changeLanguage(lng);
    windowLocalStorage.set("locale", lng);
    window.setPageDirectionFromLS();
};
