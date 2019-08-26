import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat } from "core";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual } from "components/simple";
import { Link } from "react-router-dom";

import store from "stores/accommodation-store";

@observer
class AccommodationConfirmationPage extends React.Component {

render() {
    const { t } = useTranslation();

    var request = store.booking.request,
        result  = store.booking.result;

    return (
    <React.Fragment>
        <div class="confirmation block">
            <section class="double-sections">
                <div class="half-section" />
                <div class="right-section">
                    <Breadcrumbs items={[
                        {
                            text: t("Search accommodation"),
                            link: "/search"
                        }, {
                            text: t("Booking Confirmation")
                        }
                    ]}/>
                    <ActionSteps
                        items={[t("Search accommodation"), t("Guest Details"), t("Booking confirmation")]}
                        current={2}
                    />
                    <h2>
                        {t("Booking Details")}
                    </h2>

                    <div class="result-code">
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t("Booking Reference number")}: <strong>{result.referenceCode}</strong>
                            </div>
                            <div class="second">
                                {t("Status")}: <strong>{result.status}</strong>
                            </div>
                        </div>
                    </div>

                    <Dual
                        a={<Dual addClass="line"
                                a={"Check In Date"}
                                b={dateFormat.a(result.checkInDate)}
                            />}
                        b={<Dual addClass="line"
                                a={"Check Out Date"}
                                b={dateFormat.a(result.checkOutDate)}
                            />}
                    />
                    { false && <Dual addClass="line"
                        a={"tariffCode"}
                        b={result.tariffCode}
                    /> }

                    <h2>
                        {t("Leading Passenger")}
                    </h2>
                    <Dual
                        a={<Dual addClass="line"
                                a={"First name"}
                                b={request.roomDetails[0].passengers[0].firstName}
                            />}
                        b={<Dual addClass="line"
                                a={"Last name"}
                                b={request.roomDetails[0].passengers[0].lastName}
                            />}
                    />

                    <div class="actions">
                        <a href="#">
                            <span class="icon icon-action-time-left" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-pen" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-cancel" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-print" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-writing" />
                        </a>
                        <Link to="/">
                            <button class="button green">
                                {t("Accept & reconfirm")}
                            </button>
                        </Link>
                    </div>

                </div>
                <div class="half-section" />
            </section>
        </div>
    </React.Fragment>
    );
}
}

export default AccommodationConfirmationPage;
