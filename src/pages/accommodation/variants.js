import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";

import {
    FieldText,
    FieldCheckbox,
    FieldRange
} from 'components/form';
import store from 'stores/accommodation-store';
import Breadcrumbs from "components/breadcrumbs";

@observer
class AccommodationVariantsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingPage: false
        };
    }

    variantSelect(agreement, hotel) {
        store.select(agreement, hotel);
        this.setState({
            redirectToBookingPage: true
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
            <div class="left-section filters">
                <div class="static item">{t("Map")}</div>
                <div class="expanded">
                    <img src="/images/temporary/map.png" alt="" />
                </div>
                <div class="item open">{t("Price Range")}</div>
                    <div class="expanded price-range">
                        <h4>{t("Drag the slider to choose the minimum and maximum price")}</h4>
                        <FieldRange
                            min={null}
                            max={null}
                        />
                    </div>
                <div class="item">{t("Property Type")}</div>
                <div class="item open">{t("Rating")}</div>
                    <div class="expanded">
                        <FieldCheckbox
                            label={<div>{t("Preferred")} <span>(1)</span></div>}
                        />
                        <FieldCheckbox
                            label={<div>{t("5 stars")} <span>(5)</span></div>}
                        />
                    </div>
                <div class="item open">{t("Board Basis")}</div>
                    <div class="expanded">
                        <FieldCheckbox
                            label={t("Room Only")}
                        />
                        <FieldCheckbox
                            label={t("Breakfast")}
                        />
                    </div>
                <div class="item open">{t("Rate Type")}</div>
                    <div class="expanded">
                        <FieldCheckbox
                            label={t("Flexible")}
                            value={true}
                        />
                    </div>
                <div class="item">{t("Hotel Amenities")}</div>
                <div class="item">{t("Geo Location")}</div>
                <div class="item">{t("Leisure & Sport")}</div>
                <div class="item">{t("Business Features")}</div>
                <div class="item">{t("Hotel Chain")}</div>
            </div>
            <div class="right-section">

                { store && !store.search.loaded &&
                    <div>{t("Loading...")}</div> /* todo: animation */}

                { store.search.loaded && !store.hotelArray.length &&
                    <div>{t("Nothing found")}</div> }

                { store.search.loaded && <div class="head">
                    <div class="title">
                        <h3>
                            {t("Results for")} <b>{ store.search.form?.["field-destination"] }</b> <span>({store.hotelArray.length})</span>
                        </h3>
                        <Breadcrumbs noBackButton items={[
                            {
                                text: t("Find Accommodation")
                            }, {
                                text: window.field('field-destination')
                            }
                        ]}/>
                    </div>
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
                </div> }

                { store.hotelArray.map(item =>
                <div class="variant" key={item.accommodationDetails.id}>
                    <div class="summary">
                        <div class="photo">
                            <img src={item.accommodationDetails.picture.source} alt="" />
                        </div>
                        <div class="title">
                            <h2>
                                {item.accommodationDetails.name}
                                <span class="stars">
                                    { [...Array(window.getStarNumber(item.accommodationDetails.rating))].map(() => <i />) }
                                </span>
                            </h2>
                            <div class="category">
                                {t("Hotels in")} {item.accommodationDetails.location.country}, {item.accommodationDetails.location.city}
                            </div>
                            <div class="features">
                                <span class="icon icon-info-big" />
                                <span class="icon icon-map" />
                                <span class="button pink mini-label">{t("Preferred")}</span>
                            </div>
                        </div>
                        <div class="prices">
                            <div class="from">{t("From")}</div>
                            <div class="value">{item.agreements[0].currencyCode} {item.agreements[0].price.total}</div>
                        </div>
                    </div>
                    <div class="description">
                        <span>{t("Location")}: {t("Located in")}" {item.accommodationDetails.location.city}, {item.accommodationDetails.location.country} {item.accommodationDetails.name}.
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
                            { item.agreements.map(agreement => <tr>
                                <td>
                                    {agreement.rooms[0].type}, {agreement.tariffCode}
                                    <span class="icon icon-info" />
                                </td>
                                <td>
                                    {agreement.mealPlan}
                                </td>
                                <td>
                                    {t("None")}
                                    <div class="services-info">
                                        <span class="icon icon-info orange"/> {t("Within deadline")}
                                    </div>
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
                                    <button class="button small gray round">
                                        <span class="icon icon-arrow-expand" />
                                    </button>
                                </td>
                            </tr>) }
                        { false && <React.Fragment>
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
                        </React.Fragment> }
                            </tbody>
                        </table>
                    </div>
                    <div class="show-more">
                        <button class="button blue small">
                            {t("Show all rooms")}
                        </button>
                    </div>
                </div>) }
            </div>
        </section>
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
