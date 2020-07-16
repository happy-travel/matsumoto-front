import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { loadCurrentSearchWithNewOrder } from "parts/search/search-logic";

import View from "stores/view-store";
import store from "stores/accommodation-store";

const dropdownId = "SorterDropdown";

const sort = value => {
    loadCurrentSearchWithNewOrder(value);

};

@observer
class SorterDropdown extends React.Component {
    render() {
        const { t } = useTranslation();

        return (
            <div class="sorter"
                 data-dropdown={dropdownId}
                 onClick={() => View.setOpenDropdown(dropdownId)}>
                <button class={"button-expand" + __class(store.sorter?.price < 0, "reverse")}>
                    {t("Sort by")} {store.sorter?.price ? t("price") : ""}
                </button>
                {View.isDropdownOpen(dropdownId) && <div class="usual dropdown">
                    <div class="item" onClick={()=>sort({})}>
                        {t("Usual")}
                    </div>
                    <div class="item" onClick={()=>sort({ price: 1 })}>
                        {t("High price first")}
                    </div>
                    <div class="item" onClick={()=>sort({ price: -1 })}>
                        {t("Low price first")}
                    </div>
                </div>}
            </div>
        );
    }
}

export default SorterDropdown;