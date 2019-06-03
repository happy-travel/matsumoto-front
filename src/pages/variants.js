import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FieldText } from 'components/form';

import {data} from './mock'

import Search from 'parts/search';

const Variants = () => {
    const { t, i18n } = useTranslation();

    return (
        <React.Fragment>
            <div class="variants block">
                <section class="dual">
                    <div class="left-section filters">
                        <div class="item static">Map</div>
                            <div class="expanded">
                                <img src="/images/other/temporary-map.png" alt="" />
                            </div>
                        <div class="item open">Price Range</div>
                            <div class="expanded price-range">
                                <h4>Drag the slider to choose the minimum and maximum price</h4>
                                <div class="range-slider">
                                    <div class="slider"><div><div /></div></div>
                                    <div class="range-slider-values">
                                        <span>USD  272.90</span>
                                        <span>USD  1,056.90</span>
                                    </div>
                                </div>
                            </div>
                        <div class="item">Property Type</div>
                        <div class="item open">Rating</div>
                            <div class="expanded">
                                <div class="checkbox">
                                    Preferred <span>(1)</span>
                                </div>
                                <div class="checkbox">
                                    5 stars <span>(5)</span>
                                </div>
                            </div>
                        <div class="item open">Board Basis</div>
                            <div class="expanded">
                                <div class="checkbox">
                                    Room Only
                                </div>
                                <div class="checkbox">
                                    Breakfast
                                </div>
                            </div>
                        <div class="item open">Rate Type</div>
                            <div class="expanded">
                                <div class="checkbox on">
                                    Flexible
                                </div>
                            </div>
                        <div class="item">Hotel Amenities</div>
                        <div class="item">Geo Location</div>
                        <div class="item">Leisure & Sport</div>
                        <div class="item">Business Features</div>
                        <div class="item">Hotel Chain</div>
                    </div>
                    <div class="right-section">
                        <div class="head">
                            <div class="title">
                                <h3>
                                    Results for: <b>Moscow, Russia</b> <span>(3)</span>
                                </h3>
                                <div class="breadcrumbs">
                                    Find Accommodation > CIS > Russia > Moscow
                                </div>
                            </div>
                            <div class="sorter">
                                <button className="button-expand">
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
                        </div>

                        { !(data && data.results) &&
                            <div>Nothing found</div> }
                        { data.results && data.results.map(item =>
                        <div class="variant" key={item.hotelDetails.id}>
                            <div class="summary">
                                <div class="photo">
                                    <img src={item.hotelDetails.pictures[0].source} alt="" />
                                </div>
                                <div class="title">
                                    <h2>
                                        {item.hotelDetails.name}
                                        <span class="stars"><i /><i /><i /><i /><i /></span>
                                    </h2>
                                    <div class="category">
                                        Hotels in {item.hotelDetails.location.country}, {item.hotelDetails.location.city}
                                    </div>
                                    <div class="features">
                                        <span class="icon icon-info-big" />
                                        <span class="icon icon-map" />
                                        <span class="button pink mini-label">Preferred</span>
                                    </div>
                                </div>
                                <div class="prices">
                                    <div class="from">From</div>
                                    <div class="value">USD 30.27</div>
                                </div>
                            </div>
                            <div class="description">
                                <span>Location: Located in Moscow (Strogino), Hampton by Hilton Moscow Strogino is convenient to Crocus Expo Center and All Weather Mountain Skiing Complex. This hotel is within the vicinity of Krylatskoye Ice Palace and Memorial Museum of German Anti Fascists. Rooms: 206 guestrooms featuring flat-screen televisions. Complimentary wireless Internet ac </span>
                                <span class="expand">more...</span>
                            </div>
                            <div class="table">
                                <table>
                                    <tr>
                                        <th>Room Type</th>
                                        <th>Board Basis</th>
                                        <th>Included Services</th>
                                        <th>Actions</th>
                                        <th>Total Price</th>
                                        <th />
                                    </tr>
                                    <tr>
                                        <td>
                                            Aloft Room, 1 King, Mini fridge, 27sqm/291sqft, Living/sitting area, Wireless
                                            <span class="icon icon-info" />
                                        </td>
                                        <td>
                                            Breakfast
                                        </td>
                                        <td>
                                            None
                                            <div class="services-info">
                                                <span className="icon icon-info orange"/> Within Deadline
                                            </div>
                                        </td>
                                        <td class="actions">
                                            <span class="icon icon-calendar-clock" />
                                            <span class="icon icon-warning" />
                                            <span class="icon icon-chat" />
                                            <span class="icon icon-money" />
                                            <span class="icon icon-card" />
                                        </td>
                                        <td class="price">
                                            USD 30.27
                                        </td>
                                        <td class="buttons">
                                            <button class="button small">
                                                Book now
                                            </button>
                                            <button class="button small gray round">
                                                .
                                            </button>
                                        </td>
                                    </tr>
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
};

export default Variants;
