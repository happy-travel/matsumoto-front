import View from "stores/view-store";

export default () => {
    window.addEventListener("mouseup", event => {
        if (!View.openDropdown)
            return;

        var target = event.target;
        for (var i = 0; target && i < 30; i++){
            if (target?.dataset?.dropdown) {
                if (!View.isDropdownOpen(target?.dataset?.dropdown)) {
                    if ("close" != target?.dataset?.dropdown)
                        View.setOpenDropdown(null);
                    else
                        setTimeout(() => View.setOpenDropdown(null), 0);
                }

                return;
            }
            target = target.parentNode;
        }

        View.setOpenDropdown(null);
    });

    window.addEventListener("keyup", event => {
        if (event?.keyCode == 27) // Escape
            View.setOpenDropdown(null);
    });
};
