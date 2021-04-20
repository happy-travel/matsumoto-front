import React from "react";
import {useTranslation} from "react-i18next";

const SearchNothingFound = ({ resultCount, filters, clearFilters }) => {
    const { t } = useTranslation();

    return (
        <div className="nothing-found">
            { (!!resultCount && filters) ?
                <>
                    <h2>{t("There are no results that match selected filters")}</h2>
                    <div className="button" onClick={clearFilters}>
                        {t("Clear Filters")}
                    </div>
                </> :
                <h2>{t("No accommodations available")}</h2>
            }
            <div className="head">
                <div className="title">
                    <h3>{t("Can't find what you're looking for?")}</h3>
                    <br/>
                    {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                    <br/>
                    <br/>
                    {t("Email")}: <a href="mailto:reservations@happytravel.com" className="link">
                    reservations@happytravel.com
                </a>
                </div>
            </div>
        </div>
    );
};

export default SearchNothingFound;