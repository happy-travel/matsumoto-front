import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";

import {
    FieldText,
    FieldCheckbox
} from 'components/form';
import AccommodationStore from 'stores/accommodation-store';
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
        AccommodationStore.setSelectedVariant(agreement);
        AccommodationStore.setSelectedHotel(hotel);

        this.setState({
            redirectToBookingPage: true
        });
    }

    render() {
        const { t } = useTranslation();

        const store = AccommodationStore;

        if (this.state.redirectToBookingPage)
            return <Redirect push to="/accommodation/booking" />;

        return (

<React.Fragment>
    <div class="variants block">
        <section class="double-sections">
            <div class="left-section filters">
                <div class="static item">Map</div>
                <div class="expanded">
                    <img src="/images/temporary/map.png" alt="" />
                </div>
                <div class="item open">Price Range</div>
                    <div class="expanded price-range">
                        <h4>Drag the slider to choose the minimum and maximum price</h4>
                        <div class="range-slider">
                            <div class="slider"><div><div /></div></div>
                            <div class="range-slider-values">
                                <span>USD 272.90</span>
                                <span>USD 1,056.90</span>
                            </div>
                        </div>
                    </div>
                <div class="item">Property Type</div>
                <div class="item open">Rating</div>
                    <div class="expanded">
                        <FieldCheckbox
                            label={<div>Preferred <span>(1)</span></div>}
                        />
                        <FieldCheckbox
                            label={<div>5 stars <span>(5)</span></div>}
                        />
                    </div>
                <div class="item open">Board Basis</div>
                    <div class="expanded">
                        <FieldCheckbox
                            label={"Room Only"}
                        />
                        <FieldCheckbox
                            label={"Breakfast"}
                        />
                    </div>
                <div class="item open">Rate Type</div>
                    <div class="expanded">
                        <FieldCheckbox
                            label={"Flexible"}
                            value={true}
                        />
                    </div>
                <div class="item">Hotel Amenities</div>
                <div class="item">Geo Location</div>
                <div class="item">Leisure & Sport</div>
                <div class="item">Business Features</div>
                <div class="item">Hotel Chain</div>
            </div>
            <div class="right-section">

                { store && !store.loaded &&
                    <div>Loading...</div> }

                { store.loaded && !store.hotelArray &&
                    <div>Nothing found</div> }

                { store.loaded && <div class="head">
                    <div class="title">
                        <h3>
                            Results for: <b>{ window.field('field-destination') }</b> <span>({store.hotelArray.length})</span>
                        </h3>
                        <Breadcrumbs noBackButton items={[
                            {
                                text: "Find Accommodation"
                            }, {
                                text: window.field('field-destination')
                            }
                        ]}/>
                    </div>
                    <div class="sorter">
                        <button class="button-expand">
                            Sort by
                        </button>
                    </div>
                    <div class="input-wrap">
                        <div class="form">
                            <FieldText
                                placeholder={"Search hotel name ..."}
                            />
                        </div>
                    </div>
                </div> }

                { store.hotelArray && store.hotelArray.map(item =>
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
                                Hotels in {item.accommodationDetails.location.country}, {item.accommodationDetails.location.city}
                            </div>
                            <div class="features">
                                <span class="icon icon-info-big" />
                                <span class="icon icon-map" />
                                <span class="button pink mini-label">Preferred</span>
                            </div>
                        </div>
                        <div class="prices">
                            <div class="from">From</div>
                            <div class="value">{item.agreements[0].currencyCode} {item.agreements[0].price.total}</div>
                        </div>
                    </div>
                    <div class="description">
                        <span>Location: Located in {item.accommodationDetails.location.city}, {item.accommodationDetails.location.country} {item.accommodationDetails.name}.
                            {item.accommodationDetails.generalTextualDescription && item.accommodationDetails.generalTextualDescription.descriptions && item.accommodationDetails.generalTextualDescription.descriptions.en}</span>
                        <span style={{display: 'none'}} class="expand">more...</span>
                    </div>
                    <div class="table">
                        <table>
                            <tbody>
                            <tr>
                                <th>Room Type</th>
                                <th>Board Basis</th>
                                <th>Included Services</th>
                                { false && <th>Actions</th> }
                                <th>Total Price</th>
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
                                    None
                                    <div class="services-info">
                                        <span class="icon icon-info orange"/> Within Deadline
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
                                        Book now
                                    </button>
                                    <button class="button small gray round">
                                        <span class="icon icon-arrow-expand" />
                                    </button>
                                </td>
                            </tr>) }
                        { false && <React.Fragment>
                            <tr class="alternative">
                                <th>Date</th>
                                <th />
                                <th>Availability</th>
                                <th>Price</th>
                                <th />
                            </tr>
                            <tr class="alternative">
                                <td>Fri 28 Jun 2019</td>
                                <td />
                                <td>
                                    <span class="button green mini-label">Room Available</span>
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
                            Show all rooms
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
