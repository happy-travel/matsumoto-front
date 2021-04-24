import React, { useRef} from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { searchLoadWithNewFilters } from "tasks/accommodation/search-loaders";
import { atLeastOne } from "tasks/utils/accommodation-filtering";
import AccommodationFiltersDropdown from "./accommodation-filters-dropdown";
import { useDropdown } from "simple";
import { HOTEL_STARS } from "enum";
import { $accommodation } from "stores";

const AccommodationSearchFilters = observer(({ update }) => {
    const { selected } = $accommodation;
    const { filters } = selected;
    const refElement = useRef(null);
    const refDropdown = useRef(null);
    const [dropdownOpen, toggleDropdown] = useDropdown(refElement, refDropdown);

    const removeFilter = (item) => {
        const newFilters = JSON.parse(JSON.stringify(filters));
        delete newFilters[item];
        searchLoadWithNewFilters(newFilters);
        update();
    };

    const { t } = useTranslation();
    return (
        <>
            <div className="item" ref={refElement}>
                <div
                    className="button leading-icon"
                    onClick={toggleDropdown}
                >
                    <span className="icon icon-filters" /> {t("Filters")}
                </div>

                { dropdownOpen &&
                    <AccommodationFiltersDropdown
                        close={() => toggleDropdown(false)}
                        ref={refDropdown}
                    />
                }
            </div>
            { !!filters && <>
                { ("price" in filters) &&
                    <div className="item">
                        <div
                            className="button after-icon"
                            onClick={() => removeFilter("price")}
                        >
                            {filters.price.max >= 2500 && t("From")}{" "}
                            ${filters.price.min}
                            {filters.price.max < 2500 && ` – $${filters.price.max}`}
                            <span className="icon icon-remove"/>
                        </div>
                    </div>
                }
                { ("ratings" in filters) && atLeastOne(filters.ratings) &&
                    <div className="item">
                        <div
                            className="button after-icon"
                            onClick={() => removeFilter("ratings")}
                        >
                            { HOTEL_STARS.map((val, index) => (
                                filters.ratings[val] ? index : 0
                            )).filter(v=>v).join(", ")} {t("Stars")}
                            <span className="icon icon-remove"/>
                        </div>
                    </div>
                }
                { ("boardBasis" in filters) && atLeastOne(filters.boardBasis) &&
                    <div className="item">
                        <div
                            className="button after-icon"
                            onClick={() => removeFilter("boardBasis")}
                        >
                            {(() => {
                                const bb = Object.keys(filters.boardBasis).map((val, index) => (
                                    filters.boardBasis[val] ? val : 0
                                )).filter(v=>v);
                                if (bb.length == 1)
                                    return t(bb[0]);
                                return t("Board Basis") + ": " + bb.length;
                            })()}
                            <span className="icon icon-remove"/>
                        </div>
                    </div>
                }
            </> }
        </>
    );
});

export default AccommodationSearchFilters;
