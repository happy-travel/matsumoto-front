import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { searchLoadWithNewOrder } from "tasks/accommodation/search-loaders";
import FieldSelectDropdown from "components/form/field-select/field-select-dropdown";
import { $accommodation, $view } from "stores";

const dropdownId = "sorter-price";

const AccommodationSearchSorters = observer(() => {
    const { selected } = $accommodation;
    const { sorter } = selected;

    const { t } = useTranslation();
    return (
        <div className="item">
            <div
                className={"button" + __class(sorter?.price, "after-icon")}
                data-dropdown={dropdownId}
                onClick={() => $view.setOpenDropdown(dropdownId)}
            >
                {sorter?.price ? t("Price") : t("Sort by")}
                {!!sorter?.price && <span className={"icon" + __class(sorter.price == -1, "icon-up", "icon-down")} />}
            </div>

            { $view.isDropdownOpen(dropdownId) &&
                <FieldSelectDropdown
                    options={[
                        { text: t("Unsorted"), value: {} },
                        { text: t("Price (High to Low)"), value: { price: 1 } },
                        { text: t("Price (Low to High)"), value: { price: -1 } },
                    ]}
                    setValue={searchLoadWithNewOrder}
                />
            }
        </div>
    );
});

export default AccommodationSearchSorters;
