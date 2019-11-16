import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";

import { API, dateFormat, price } from "core";
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
            expanded: {},
            loading: false
        };
        this.showDetailsModal = this.showDetailsModal.bind(this);
        this.expand = this.expand.bind(this);
    }

    showDetailsModal(id) {
        UI.setModal(MODALS.ACCOMMODATION_DETAILS);
        UI.setHotelDetails(null);
        API.get({
            url: API.ACCOMMODATION_DETAILS(id),
            success: (result) =>
                UI.setHotelDetails(result),
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

    expand(index) {
        this.setState({
            expanded: {
                ...this.state.expanded,
                [index]: true
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
                                placeholder={t("Search hotel name ...")}
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
                                {t("Hotels in")} {item.accommodationDetails.location.country}, {item.accommodationDetails.location.city}
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
                        <table>
                            <tbody>
                            <tr>
                                <th>{t("Room Type")}</th>
                                <th>{t("Board Basis")}</th>
                                <th>{t("Deadline")}</th>
                                { false && <th>{t("Actions")}</th> }
                                <th>{t("Room Price")}</th>
                                <th />
                            </tr>
                            { item.agreements.slice(0, !this.state.expanded[hotelIndex] ? 3 : undefined).map(agreement => <tr>
                                <td>
                                    {agreement.rooms.map(room => <div>{room.type}</div>)}
                                </td>
                                <td>
                                    {agreement.mealPlan}
                                </td>
                                <td>
                                    { moment().isAfter(agreement.deadlineDate) ? <div class="services-info">
                                        <span class="icon icon-info orange"/> {t("Within deadline")}
                                        <br/>{dateFormat.a(agreement.deadlineDate)}
                                    </div> :
                                        dateFormat.a(agreement.deadlineDate)
                                    }
                                </td>
                                { false && <td class="actions">
                                    <span class="icon icon-calendar-clock" />
                                    <span class="icon icon-warning" />
                                    <span class="icon icon-chat" />
                                    <span class="icon icon-money" />
                                    <span class="icon icon-card" />
                                </td> }
                                <td class="price">
                                    {agreement.rooms.map(room => <div>
                                        {price(agreement.currencyCode, room.roomPrices[0].nett)}
                                    </div>)}
                                </td>
                                <td class="buttons">
                                    <button class="button small" onClick={() => this.variantSelect(agreement, item.accommodationDetails)}>
                                        {t("Book now")}
                                    </button>
                                    { false && <button class="button small gray round">
                                        <span class="icon icon-arrow-expand" />
                                    </button> /* todo: finish this button */ }
                                </td>
                            </tr>) }
                        { /* todo: <React.Fragment>
                            <tr class="alternative">
                                <th>{t("Date")}</th>
                                <th />
                                <th>{t("Availability")}</th>
                                <th>{t("Price")}</th>
                                <th />
                            </tr>
                            <tr class="alternative">
                                <td>Fri 28 Jun 2019</td>
                                <td />
                                <td>
                                    <span class="button green mini-label">{t("Room Available")}</span>
                                </td>
                                <td class="price">USD 70.50</td>
                                <td />
                            </tr>
                        </React.Fragment> */ }
                            </tbody>
                        </table>
                    </div>
                    { !this.state.expanded[hotelIndex] && <div class="show-more">
                        <button class="button blue small" onClick={() => this.expand(hotelIndex)}>
                            {t("Show all rooms")}
                        </button>
                    </div> }
                </div>) }
            </div>
        </section> }
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
