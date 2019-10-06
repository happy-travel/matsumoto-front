import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";

import { API, dateFormat } from "core";
import store from 'stores/accommodation-store';
import UI, { MODALS } from "stores/ui-store";

import AccommodationFilters from "parts/accommodation-filters"
import {
    FieldText,
    FieldCheckbox
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import { Stars } from "components/simple";

@observer
class AccommodationVariantsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingPage: false,
            expanded: {}
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
            redirectToBookingPage: true
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
        <section class="double-sections">
            <AccommodationFilters />
            <div class="right-section">

                { store && !store.search.loaded &&
                    <div>{t("Loading...")}</div> /* todo: animation */}

                { store.search.loaded && <div class="head">
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
                </div> }

                { store.search.loaded && !store.hotelArray.length &&
                    <div>{t("Nothing found")}</div> }

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
                            <div class="value">{item.agreements[0].currencyCode} {item.agreements[0].price.total}</div>
                        </div>
                    </div>
                    <div class="description">
                        <span>{t("Located in")} {item.accommodationDetails.location.city}, {item.accommodationDetails.location.country} {item.accommodationDetails.name}.{" "}
                            {item.accommodationDetails.generalTextualDescription && item.accommodationDetails.generalTextualDescription.descriptions && item.accommodationDetails.generalTextualDescription.descriptions.en}</span>
                        <span style={{display: 'none'}} class="expand">{t("more...")}</span>
                    </div>
                    <div class="table">
                        <table>
                            <tbody>
                            <tr>
                                <th>{t("Room Type")}</th>
                                <th>{t("Board Basis")}</th>
                                <th>{t("Included Services")}</th>
                                { false && <th>{t("Actions")}</th> }
                                <th>{t("Total Price")}</th>
                                <th />
                            </tr>
                            { item.agreements.slice(0, !this.state.expanded[hotelIndex] ? 3 : undefined).map(agreement => <tr>
                                <td>
                                    {agreement.rooms[0].type}
                                    { moment().isAfter(agreement.deadlineDate) && <div class="services-info">
                                        <span class="icon icon-info orange"/> {t("Within deadline")}
                                        <br/>{dateFormat.a(agreement.deadlineDate)}
                                    </div> }
                                </td>
                                <td>
                                    {agreement.mealPlan}
                                </td>
                                <td>
                                    {t("None")}
                                </td>
                                { false && <td class="actions">
                                    <span class="icon icon-calendar-clock" />
                                    <span class="icon icon-warning" />
                                    <span class="icon icon-chat" />
                                    <span class="icon icon-money" />
                                    <span class="icon icon-card" />
                                </td> }
                                <td class="price">
                                    {agreement.currencyCode} {agreement.price.total}
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
        </section>
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
