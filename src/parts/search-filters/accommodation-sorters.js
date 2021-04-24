import React, { useRef } from "react";
import { observer } from "mobx-react";
import { useDropdown } from "simple";
import { useTranslation } from "react-i18next";
import { searchLoadWithNewOrder } from "tasks/accommodation/search-loaders";
import FieldSelectDropdown from "components/form/field-select/field-select-dropdown";
import { $accommodation } from "stores";

const AccommodationSearchSorters = observer(() => {
    const { selected } = $accommodation;
    const { sorter } = selected;
    const refElement = useRef(null);
    const refDropdown = useRef(null);
    const [dropdownOpen, toggleDropdown] = useDropdown(refElement, refDropdown);

    const { t } = useTranslation();
    return (
        <div className="item">
            <div
                className={"button" + __class(sorter?.price, "after-icon")}
                onClick={toggleDropdown}
                ref={refElement}
            >
                {sorter?.price ? t("Price") : t("Sort by")}
                {!!sorter?.price && <span className={"icon" + __class(sorter.price == -1, "icon-up", "icon-down")} />}
            </div>

            { dropdownOpen &&
                <FieldSelectDropdown
                    options={[
                        { text: t("Unsorted"), value: {} },
                        { text: <>{t("Price")} <em>({t("High to Low")})</em></>, value: { price: 1 } },
                        { text: <>{t("Price")} <em>({t("Low to High")})</em></>, value: { price: -1 } },
                    ]}
                    setValue={(option) => searchLoadWithNewOrder(option.value)}
                    ref={refDropdown}
                />
            }
        </div>
    );
});

export default AccommodationSearchSorters;
