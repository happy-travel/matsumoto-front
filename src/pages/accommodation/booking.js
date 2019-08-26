import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";
import { API, dateFormat } from "core";
import { Formik } from "formik";

import {
    FieldText,
    FieldTextarea,
    FieldSwitch,
    FieldCheckbox
} from 'components/form';
import Breadcrumbs from 'components/breadcrumbs';
import ActionSteps from 'components/action-steps';
import { Dual } from 'components/simple';
import { Redirect } from "react-router-dom";

import store from 'stores/accommodation-store';

@observer
class AccommodationBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToConfirmationPage: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        if (!store.selected.hotel.id || !store.selected.variant.id)
            return null; //todo: another answer

        var hotel = store.selected.hotel,
            variant = store.selected.variant,
            search = store.search.request;

        //todo: refactoring
        var adults = store.search.request.roomDetails[0].adultsNumber,
            total = adults + store.search.request.roomDetails[0].childrenNumber,
            passengers = [];

        for (var i = 0; i < total; i++) {
            passengers.push({
                "title": "Mr",
                "lastName": values["field-booking-passenger-last-name"][i],
                "firstName": values["field-booking-passenger-first-name"][i],
                "age": i < adults ? 33 : 12,
                "initials":"",
                "isLeader": i == 0
            })
        }

        var request = {
            "availabilityId": store.search.result.availabilityId,
            "nationality": search.nationality,
            "paymentMethod": "CreditCard",
            "residency": search.residency,
            "mainPassengerName": passengers[0].firstName + " " + passengers[0].lastName,
            "agreementId": variant.id,
            "roomDetails": [
                {
                    "type": variant.rooms[0].type, //todo: make it real
                    "passengers": passengers
                }
            ],
            "features": []
        };
        store.setBookingRequest(request);

        API.post({
            url: API.ACCOMMODATION_BOOKING,
            body: request,
            after: (data) => {
                store.setBookingResult(data || {});
            }
        });

        this.setState({
            redirectToConfirmationPage: true
        });
    }

    render() {
        const { t } = useTranslation();

        if (!store.selected?.hotel?.id || !store.selected?.variant?.id)
            return null; //todo: another answer

        var hotel = store.selected.hotel,
            variant = store.selected.variant;

        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return (

<React.Fragment>
    <div class="booking block">
        <section class="double-sections">
            <div class="left-section filters">
                <div class="static item">{t('Booking Summary')}</div>
                <div class="expanded">
                    <img src={hotel.picture.source} alt={hotel.picture.caption} class="round" />
                </div>
                <div class="static item no-border">
                    {hotel.name}
                </div>
                <div class="subtitle">
                    {hotel.location.address}
                    , {hotel.location.city}
                    , {hotel.location.country}
                </div>

                <div class="static item">{t('Your Reservation')}</div>
                <Dual
                    a={t('Arrival Date')}
                    b={dateFormat.a(variant.roomPrices[0].fromDate)}
                />
                <Dual
                    a={t('Departure Date')}
                    b={dateFormat.a(variant.roomPrices[0].toDate)}
                />
                <Dual
                    a={t('Number of Rooms')}
                    b={'1'}
                />

                <div class="static item">{t('Room Information')}</div>
                <Dual
                    a={t('Room Type')}
                    b={variant.roomPrices[0].type}
                />
                { false && [<Dual
                    a={t('Board Basis')}
                    b={'Room Only'}
                />,
                <Dual
                    a={t('Occupancy')}
                    b={'2 Adults , 2 Children, Children Ages: 3, 14'}
                />] /* todo */ }

                <div class="static item">{t('Room & Total Cost')}</div>
                <Dual
                    a={t('Room Cost')}
                    b={`${variant.currencyCode} ${variant.price.total}`}
                />
                <Dual
                    a={t('Total Cost')}
                    b={`${variant.currencyCode} ${variant.price.total}`}
                />
                <div class="total-cost">
                    <div>{t('Reservation Total Cost')}</div>
                    <div>{`${variant.currencyCode} ${variant.price.total}`}</div>
                </div>
            </div>
            <div class="right-section">
                <Breadcrumbs items={[
                    {
                        text: t("Search accommodation"),
                        link: "/search"
                    }, {
                        text: t("Guest Details")
                    }
                ]}/>
                <ActionSteps
                    items={[t("Search accommodation"), t("Guest Details"), t("Booking confirmation")]}
                    current={1}
                />
                <h2>
                    <span>Room 1:</span> {variant.contractType}
                </h2>

                <Formik
                    initialValues={{

                    }}
                    validate={values => {
                        let errors = {};
                        return errors;
                    }}
                    onSubmit={this.submit}
                    render={formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <div class="form">
                                <div class="part">
                                    <table class="people"><tbody>
                                        <tr>
                                            <th><span class="required">{t('Title')}</span></th>
                                            <th><span class="required">{t('First Name')}</span></th>
                                            <th><span class="required">{t('Last Name')}</span></th>
                                        </tr>
                                        {([
                                            ...Array(store.search.request.roomDetails[0].adultsNumber),
                                            ...Array(store.search.request.roomDetails[0].childrenNumber),
                                        ]).map((item, index) => (<tr>
                                            <td>
                                                <FieldText formik={formik}
                                                    id={"field-booking-passenger-title[" + index + "]"}
                                                    placeholder={'Please select one'}
                                                    value={index < store.search.request.roomDetails[0].adultsNumber ? "Mr." : "Child"}
                                                    disabled={index >= store.search.request.roomDetails[0].adultsNumber}
                                                />
                                            </td>
                                            <td class="bigger">
                                                <FieldText formik={formik}
                                                    id={"field-booking-passenger-first-name[" + index + "]"}
                                                    placeholder={'Please enter first name'}
                                                    clearable
                                                />
                                            </td>
                                            <td class="bigger">
                                                <FieldText formik={formik}
                                                    id={"field-booking-passenger-last-name[" + index + "]"}
                                                    placeholder={'Please enter last name'}
                                                    clearable
                                                />
                                            </td>
                                        </tr>))}
                                    </tbody></table>
                                </div>

                                <div class="part">
                                    <div class="row">
                                        <div class="vertical-label">{t('Agent Reference')}</div>
                                        <FieldText formik={formik}
                                            id={"field-booking-agent-reference"}
                                            placeholder={'Please enter here'}
                                            clearable
                                        />
                                    </div>
                                    <div class="row">
                                        <div class="vertical-label">
                                            <div>{t('Extra Meal')} <span class="icon icon-info" /></div>
                                        </div>
                                        <FieldSwitch
                                            id={"field-booking-extra-meal"}
                                        />
                                    </div>
                                    <div class="row">
                                        <div class="vertical-label">
                                            <div>{t('Special Request')} <span class="icon icon-info" /></div>
                                        </div>
                                        <FieldSwitch formik={formik}
                                            id={"field-booking-special-request"}
                                            value={true}
                                        />
                                    </div>

                                    <FieldTextarea formik={formik}
                                        id={"field-booking-agent-reference"}
                                        placeholder={'Please enter your message'}
                                        label={t('Your Requests')}
                                    />
                                </div>

                                <div class="part">
                                    <table class="checkboxes"><tbody>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request Interconnecting Rooms"} /></td>
                                            <td><FieldCheckbox label={"Request for an Early Check In"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Require a Smoking Room"} /></td>
                                            <td><FieldCheckbox label={"Request for a Late Check Out"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Require a Non Smoking Room"} /></td>
                                            <td><FieldCheckbox label={"Please note that Guest is a VIP"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request Room on a Low Floor"} /></td>
                                            <td><FieldCheckbox label={"Please note that Guests are a Honeymoon Couple"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request Room on a High Floor"} /></td>
                                            <td><FieldCheckbox label={"Request for a Baby Cot"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request for Late Check-In"} /></td>
                                            <td />
                                        </tr>
                                    </tbody></table>
                                </div>

                                { false && <div class="part">
                                    <h2>
                                        Do You Wish to Add Additional Services?
                                    </h2>
                                </div> }

                                <div class="final">
                                    <div class="dual">
                                        <div class="first">
                                            <FieldCheckbox
                                                label={<div>
                                                    I have read and accepted the booking <a href="#" class="underlined link">terms & conditions</a>
                                                </div>}
                                            />
                                        </div>
                                        <div class="second">
                                            <button type="submit" class="button">Confirm booking</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    )}
                />
            </div>
        </section>
    </div>
</React.Fragment>

    );
}
}

export default AccommodationBookingPage;
