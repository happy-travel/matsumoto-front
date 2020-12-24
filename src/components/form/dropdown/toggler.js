import View from "stores/view-store";

const selfToggleIds = ["LocaleSwitcherDropdown", "SorterDropdown"];
const hideDropdown = () => View.setOpenDropdown(null);

export default () => {
    window.addEventListener("mouseup", event => {
        if (!View.openDropdown)
            return;

        var target = event.target;
        for (var i = 0; target && i < 30; i++){
            var dataDropdown = target?.dataset?.dropdown;
            if (dataDropdown) {
                if (!View.isDropdownOpen(dataDropdown))
                    hideDropdown();
                else if (selfToggleIds.indexOf(target?.dataset?.dropdown) > -1)
                    setTimeout(hideDropdown, 0);

                return;
            }
            target = target.parentNode;
        }

        hideDropdown();
    });

    window.addEventListener("keyup", event => {
        if (event?.keyCode == 27) // Escape
            View.setOpenDropdown(null);
    });
};
