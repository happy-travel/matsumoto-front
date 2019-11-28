import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";

import { API, dateFormat, price, plural } from "core";
import store from 'stores/accommodation-store';
import UI, { MODALS } from "stores/ui-store";

import AccommodationFilters from "parts/accommodation-filters"
import {
    FieldText,
    FieldCheckbox
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import { Stars, Loader } from "components/simple";

@observer
class AccommodationVariantsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingPage: false,
            loading: false
        };
        this.showDetailsModal = this.showDetailsModal.bind(this);
    }

    showDetailsModal(id) {
        UI.setModal(MODALS.ACCOMMODATION_DETAILS);
        UI.setModalData(null);
        API.get({
            url: API.ACCOMMODATION_DETAILS(id),
            success: (result) =>
                UI.setModalData(result),
            error: () =>
                console.log("wrong id or server error on accommodation details getter") /* todo: handle error */
        });
    }

    variantSelect(agreement, hotel) {
        store.select(agreement, hotel);
        this.setState({
            loading: true
        });

        /*
        API.post({
            url: API.ACCOMMODATION_SEARCH,
            body: {
                ...store.search.request,
                searchInfo: {
                    availabilityId: store.search.result.availabilityId,
                    hotelId: hotel.id,
                    price: agreement.price.total,
                    tariffCode: agreement.tariffCode
                }
            },
            success: (result) => {
                if (result.results?.[0].accommodationDetails.id != hotel.id) {
                    UI.setTopAlertText("Sorry, this room is not available now");
                    return;
                }
                for (var i = 0; i < result.results[0].agreements.length; i++)
                    if (
                        result.results[0].agreements[i].tariffCode == agreement.tariffCode &&
                        result.results[0].agreements[i].contractType == agreement.contractType &&
                        result.results[0].agreements[i].mealPlan == agreement.mealPlan &&
                        result.results[0].agreements[i].rooms[0].type == agreement.rooms[0].type
                    ) {
                        store.select(result.results[0].agreements[i], result.results[0].accommodationDetails);
                        this.setState({
                            redirectToBookingPage: true
                        });
                        return;
                    }

                UI.setTopAlertText("Sorry, this room is not available now #2");
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

        return; */

        API.get({
            url: API.AVAILABILITY_DETAILS(store.search.result.availabilityId, agreement.id),
            success: (result) => {
                if (result?.accommodationId != hotel.id) { // todo: better error definition and error handling
                    UI.setTopAlertText("Sorry, this room is not available now");
                    return;
                }
                store.select(result.agreement, hotel, result); // here first "hotel" model is fuller, so I use it
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
        const { t } = useTranslation();

        if (this.state.redirectToBookingPage)
            return <Redirect push to="/accommodation/booking" />;

        return (

<React.Fragment>
    <div class="variants block">
        { (store && !store.search.loaded) ?
        <Loader /> :

        <section class="double-sections">
            <AccommodationFilters />
            <div class="right-section">
                <div class="head">
                    <div class="title">
                        <h3>
                            {t("Results for")}: <b>{ store.search.form?.["destination"] }</b> <span>({store.hotelArray.length})</span>
                        </h3>
                        <Breadcrumbs noBackButton items={[
                            {
                                text: t("Find Accommodation")
                            }, {
                                text: store.search.form?.["destination"] || ""
                            }
                        ]}/>
                    </div>
                    { /* todo:
                    <div class="sorter">
                        <button class="button-expand">
                            {t("Sort by")}
                        </button>
                    </div>
                    <div class="input-wrap">
                        <div class="form">
                            <FieldText
                                placeholder={t("Search by a hotel name...")}
                            />
                        </div>
                    </div>
                    */ }
                </div>

                { store.search.loaded && !store.hotelArray.length &&
                    <div>{t("Nothing found")}</div> }

                { this.state.loading && <Loader page /> }

                { store.hotelArray.map((item, hotelIndex) =>
                <div class="variant" key={item.accommodationDetails.id}>
                    <div class="summary">
                        <div class="photo">
                            <img src={item.accommodationDetails.picture.source} alt="" />
                        </div>
                        <div class="title" onClick={() => this.showDetailsModal(item.accommodationDetails.id)} >
                            <h2>
                                <u>{item.accommodationDetails.name}</u>
                                <Stars count={item.accommodationDetails.rating} />
                            </h2>
                            <div class="category">
                                {t("Accommodation in")} {item.accommodationDetails.location.country}, {item.accommodationDetails.location.city}<br/>
                                {item.accommodationDetails.location.address}
                            </div>
                            <div class="features">
                                <span class="icon icon-info-big"/>
                                { /* todo: <span class="icon icon-map" /> */ }
                                { /* todo: <span class="button pink mini-label">{t("Preferred")}</span> */ }
                            </div>
                        </div>
                        <div class="prices">
                            <div class="from">{t("From")}</div>
                            <div class="value">{price(item.agreements[0].currencyCode, item.agreements[0].price.total)}</div>
                        </div>
                    </div>
                    <div class="description">
                        <span>{t("Located in")} {item.accommodationDetails.location.city}, {item.accommodationDetails.location.country} {item.accommodationDetails.name}.{" "}
                            {item.accommodationDetails.generalTextualDescription && item.accommodationDetails.generalTextualDescription.descriptions && item.accommodationDetails.generalTextualDescription.descriptions.en}</span>
                        { /* <span class="expand">{t("more...")}</span> */ }
                    </div>
                    <div class="table">
                        <div class="title">
                            {t("Recommended variant for")}{" "}
                            {plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}
                        </div>
                        <div class="space">
                            <div class="count">
                                {plural(t, store.search.result.numberOfNights, "Night")},
                                {" "}{plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}
                            </div>
                            <div class="price">
                                {price(item.agreements[0].currencyCode, item.agreements[0].price.total)}
                            </div>
                            <button class="button small" onClick={() => this.variantSelect(item.agreements[0], item.accommodationDetails)}>
                                {t("Choose Room")}
                            </button>
                        </div>
                        { item.agreements.slice(0, 2).map(agreement => <div class="row">
                            <div class="icons">
                                <span class="icon icon-man" />
                                {(agreement.rooms.length == 1 && agreement.rooms[0].type == "Single") ? null : <span class="icon icon-man" />}
                            </div>
                            <div class="main">
                                <h3>
                                    {agreement.rooms.map(room => ("1 x " + room.type)).join(", ")}
                                </h3>
                                <div>
                                    { agreement.deadlineDate ?
                                    <div class={"info" + (moment().isAfter(agreement.deadlineDate) ? " warning" : "")}>
                                        {t("Within deadline")} – {dateFormat.a(agreement.deadlineDate)}
                                    </div> :
                                    <div class="info green">
                                        {t("FREE Cancellation - Without Prepayment")}
                                    </div>
                                    }
                                </div>
                                <div class="info green">
                                    {agreement.boardBasisCode}: {"RO" == agreement.boardBasisCode ? t("Room only") : (t("Breakfast Included") + " " + agreement.mealPlan) }
                                </div>
                                <div class="paragraph">
                                    {agreement.contractType}
                                </div>
                            </div>
                        </div>) }
                    </div>
                </div>) }
            </div>
        </section> }
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
