import UI from "stores/ui-store";

export default () => {
    window.addEventListener("mouseup", (event) => {
        if (!UI.openDropdown)
            return;

        var target = event.target;
        for (var i = 0; target && i < 30; i++){
            if (target?.dataset?.dropdown) {
                if (UI.openDropdown != target?.dataset?.dropdown) {
                    if ("close" != target?.dataset?.dropdown)
                        UI.setOpenDropdown(null);
                    else
                        setTimeout(() => UI.setOpenDropdown(null), 0);
                }

                return;
            }
            target = target.parentNode;
        }

        UI.setOpenDropdown(null);
    });
};
