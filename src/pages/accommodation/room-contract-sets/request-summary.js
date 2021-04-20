import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { date, PassengersCount } from "simple";
import { $accommodation } from "stores";

const RequestSummaryBillet = observer(() => {
    const { t } = useTranslation();
    const { search } = $accommodation;
    return (
        <div className="billet sticky hide-mobile">
            <h2>{t("You were looking for")}</h2>
            <div className="line">
                <span className="icon icon-summary-location" />
                {search.request.destination}
            </div>
            <div className="line">
                <span className="icon icon-summary-calendar" />
                {date.format.day(search.request.checkInDate)} {" – "}
                {date.format.day(search.request.checkOutDate)}
            </div>
            <div className="line">
                <span className="icon icon-summary-guests" />
                <PassengersCount
                    adults={search.request.adultsTotal}
                    children={search.request.childrenTotal}
                />{", "}
                {__plural(t, search.numberOfNights, "Night")}
            </div>
            <Link to="/search" className="button">
                {t("View Other Options")}
            </Link>
        </div>
    );
});

export default RequestSummaryBillet;
