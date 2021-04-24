import { $view } from "stores";

const selfToggleIds = ["LocaleSwitcherDropdown", "SorterDropdown"];

const hideDropdown = (softly) => $view.setOpenDropdown(null, softly);

export default () => {
    window.addEventListener("mouseup", event => {
        if (!$view.openDropdown)
            return;
        setTimeout(() => {
            try {
                let target = event.target;
                for (let i = 0; target && i < 30; i++) {
                    let dataDropdown = target?.dataset?.dropdown;
                    if (dataDropdown) {
                        if (!$view.isDropdownOpen(dataDropdown))
                            hideDropdown(true);
                        else if (selfToggleIds.includes(target?.dataset?.dropdown))
                            hideDropdown();

                        return;
                    }
                    target = target.parentNode;
                }
                hideDropdown();
            } catch {}
        }, 0);
    });

    window.addEventListener("keyup", event => {
        if (event.key == "Escape")
            if ($view.openDropdown)
                $view.setOpenDropdown(null);
    });
};
