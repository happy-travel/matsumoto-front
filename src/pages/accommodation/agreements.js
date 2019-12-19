import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";
import { groupAndCount } from "components/simple";

import { API, dateFormat, price, plural } from "core";
import store from 'stores/accommodation-store';
import UI from "stores/ui-store";
import AccommodationCommonDetails from "parts/accommodation-details";

import {
    FieldText,
    FieldCheckbox
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import { Stars, Loader } from "components/simple";

@observer
class AccommodationAgreementsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingPage: false,
            redirectToVariantsPage: false,
            loading: false
        };
        this.agreementSelect = this.agreementSelect.bind(this);
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 400);
    }

    back() {
        this.setState({
            redirectToVariantsPage: true
        });
    }

    showSearch() {
        window.scrollTo(0, 0);
    }

    agreementSelect(agreement) {
        this.setState({
            loading: true
        });
        API.get({
            url: API.AVAILABILITY_DETAILS(store.selected.accommodation.availabilityId, agreement.id),
            success: (result) => {
                if (result?.accommodationId != store.selected.accommodation.accommodationDetails.id) { // todo: better error definition and error handling
                    UI.setTopAlertText("Sorry, this room is not available now");
                    return;
                }
                store.selectAgreement(result.agreement, result);
                this.setState({
                    redirectToBookingPage: true
                });
            },
            error: (error) => {
                UI.setTopAlertText("Sorry, this room is not available now, try again later");
                if (error)
                    console.log("error: " + error);
            },
            after: () => {
                this.setState({
                    loading: false
                });
            }
        });
    }

    render() {
        const { t } = useTranslation(),
            item = store.selected.accommodation;

        if (this.state.redirectToBookingPage)
            return <Redirect push to="/accommodation/booking" />;

        if (this.state.redirectToVariantsPage)
            return <Redirect push to="/search" />;

        return (

<React.Fragment>
    <div class="variants block agreements">
        <section class="double-sections">
            <div class="left-section filters">
                <div class="billet">
                    <div class="line">
                        {t("Like, but are you not sure?")}
                    </div>
                    <button class="button small" onClick={this.back}>
                        {t("Similar accommodations")}
                    </button>
                </div>
            </div>
            <div class="right-section">
                <div class="title">
                    <Breadcrumbs noBackButton items={[
                        {
                            text: t("Find Accommodation")
                        }, {
                            text: store.search.form?.["destination"] || ""
                        }, {
                            text: item.accommodationDetails.name
                        }
                    ]}/>
                </div>
                { this.state.loading && <Loader page /> }

                <AccommodationCommonDetails
                    accommodation={item.accommodationDetails}
                    fromPage
                />

                <h2>{t("Room Availability")}</h2>

                <div class="billet">
                    <div class="part">
                        <div class="subpart">
                            <div class="h1">{t("Check In Date")}</div>
                            <div class="h2">{dateFormat.d(store.search.request.checkInDate)}</div>
                        </div>
                        <div class="subpart">
                            <div class="h1">{t("Check Out Date")}</div>
                            <div class="h2">{dateFormat.d(store.search.request.checkOutDate)}</div>
                            <div class="h3">{plural(t, store.search?.result?.numberOfNights, "Night")}</div>
                        </div>
                        <div class="subpart">
                            <div class="h1">{t("Guests")}</div>
                            <div class="h2">{plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}</div>
                        </div>
                    </div>
                    <div class="part">
                        <button class="button small" onClick={this.showSearch}>
                            {t("Change Search Settings")}
                        </button>
                    </div>
                </div>

                <div class="variant">
                    <div class="table">
                        <table class="table agt">
                            <thead>
                                <tr>
                                    <th>{t("Room Type")}</th>
                                    <th class="icons">{t("Accommodates")}</th>
                                    <th class="price">{t("Price for")} {plural(t, store.search?.result?.numberOfNights, "Night")}</th>
                                    <th class="pros">{t("Pros")}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                            { item.agreements.map(agreement =>
                                <tr>
                                    <td class="agreement">
                                        {groupAndCount(agreement.rooms)}<br/>
                                        {agreement.contractType}
                                    </td>
                                    <td class="icons">
                                        <span class="icon icon-man" />
                                        {(agreement.rooms.length == 1 && agreement.rooms[0].type == "Single") ? null : <span class="icon icon-man" />}
                                    </td>
                                    <td class="price">
                                        {price(agreement.price)}
                                    </td>
                                    <td class="pros">
                                        <div class="one green">
                                            {agreement.boardBasisCode}: {"RO" == agreement.boardBasisCode ? t("Room Only") : (t("Breakfast Included") + ", " + agreement.mealPlan) }
                                        </div>
                                        <div class="one">
                                            { agreement.deadlineDate ?
                                            <div class={"info" + (moment().isAfter(agreement.deadlineDate) ? " warning" : " green")}>
                                                {t("Within deadline")} – {dateFormat.a(agreement.deadlineDate)}
                                            </div> :
                                            <div class="info green">
                                                {t("FREE Cancellation - Without Prepayment")}
                                            </div>
                                            }
                                        </div>
                                    </td>
                                    <td class="holder">
                                        <button class="button small" onClick={() => this.agreementSelect(agreement, item.accommodationDetails)}>
                                            {t("Book it")}
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    </div>
</React.Fragment>
);
    }
}

export default AccommodationAgreementsPage;
