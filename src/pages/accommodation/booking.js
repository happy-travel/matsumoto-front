import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API, dateFormat } from "core";
import { Formik, FieldArray } from "formik";

import {
    FieldText,
    FieldTextarea,
    FieldSwitch,
    FieldCheckbox,
    FieldSelect
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual, Loader } from "components/simple";
import { Redirect, Link } from "react-router-dom";
import { accommodationBookingValidator } from "components/form/validation";

import store from "stores/accommodation-store";
import PaymentPage from "pages/payment/payment";

@observer
class AccommodationBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToConfirmationPage: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values, { setSubmitting }) {
        if (!store.selected.hotel.id || !store.selected.variant.id)
            return null; //todo: another answer

        var variant = store.selected.variant,
            search = store.search.request;

        //todo: refactoring
        var adults = store.search.request.roomDetails[0].adultsNumber,
            total = adults + store.search.request.roomDetails[0].childrenNumber,
            passengers = [];

        for (var i = 0; i < total; i++)
            passengers.push({
                "title": "Mr", // todo: get real
                "firstName": values.passengers[i].firstName,
                "lastName": values.passengers[i].lastName,
                "age": i < adults ? 33 : 12,
                "initials":"",
                ...( i == 0 ? {"isLeader": true} : {} )
            });

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
            after: (result, data) => {
                store.setBookingResult(result, data);
                setSubmitting(false);
            }
        });

        // todo: payment via user account wallet:
    //    this.setState({
    //        redirectToConfirmationPage: true
    //    });
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
                <div class="static item">{t("Booking Summary")}</div>
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

                <div class="static item">{t("Your Reservation")}</div>
                <Dual
                    a={<span>Arrival<br/> Date</span>}
                    b={dateFormat.a(store.search.result.checkInDate)}
                />
                <Dual
                    a={<span>Departure<br/> Date</span>}
                    b={dateFormat.a(store.search.result.checkOutDate)}
                />
                <Dual
                    a={t("Number of Rooms")}
                    b={"1"}
                />

                <div class="static item">{t("Room Information")}</div>
                <Dual
                    a={t("Room Type")}
                    b={variant.rooms[0].type}
                />
                { false && [<Dual
                    a={t("Board Basis")}
                    b={"Room Only"}
                />,
                <Dual
                    a={t("Occupancy")}
                    b={"2 Adults , 2 Children, Children Ages: 3, 14"}
                />] /* todo */ }

                <div class="static item">{t("Room & Total Cost")}</div>
                <Dual
                    a={t("Room Cost")}
                    b={`${variant.currencyCode} ${variant.price.total}`}
                />
                <Dual
                    a={t("Total Cost")}
                    b={`${variant.currencyCode} ${variant.price.total}`}
                />
                <div class="total-cost">
                    <div>{t("Reservation Total Cost")}</div>
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
                    items={[t("Search accommodation"), t("Guest Details"), t("Booking Confirmation")]}
                    current={1}
                />
                <h2>
                    <span>Room 1:</span> {variant.contractType}
                </h2>

                <Formik
                    initialValues={{
                        passengers: [
                            ...Array(store.search.request.roomDetails[0].adultsNumber),
                            ...Array(store.search.request.roomDetails[0].childrenNumber),
                        ]
                    }}
                    validationSchema={accommodationBookingValidator}
                    onSubmit={this.submit}
                    render={formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <div class="form">
                                <div class="part">
                                    <table class="people"><tbody>
                                        <tr>
                                            <th><span class="required">{t("Title")}</span></th>
                                            <th><span class="required">{t("First Name")}</span></th>
                                            <th><span class="required">{t("Last Name")}</span></th>
                                        </tr>

                                        <FieldArray
                                            name="friends"
                                            render={() => (
                                        <React.Fragment>
                                            {formik.values.passengers.map((item, index) => (
                                            <tr>
                                                <td>
                                                { index < store.search.request.roomDetails[0].adultsNumber ?
                                                    <FieldSelect formik={formik}
                                                        id={`passengers.${index}.title`}
                                                        placeholder={t("Please select one")}
                                                        options={[
                                                            { value: "Mr.", text: t("Mr.") },
                                                            { value: "Mrs.", text: t("Mrs.") }
                                                        ]}
                                                    /> :
                                                    <FieldText formik={formik}
                                                        id={`passengers.${index}.title`}
                                                        value={t("Child")}
                                                        disabled
                                                    />
                                                }
                                                </td>
                                                <td class="bigger">
                                                    <FieldText formik={formik}
                                                        id={`passengers.${index}.firstName`}
                                                        placeholder={t("Please enter first name")}
                                                        clearable
                                                    />
                                                </td>
                                                <td class="bigger">
                                                    <FieldText formik={formik}
                                                        id={`passengers.${index}.lastName`}
                                                        placeholder={t("Please enter last name")}
                                                        clearable
                                                    />
                                                </td>
                                            </tr>))}
                                        </React.Fragment>
                                        )} />
                                    </tbody></table>
                                </div>

                                <div class="part">
                                    <div class="row no-margin">
                                        <div class="vertical-label">{t("Agent Reference")}</div>
                                        <FieldText formik={formik}
                                            id={"agent-reference"}
                                            placeholder={t("Please enter here")}
                                            clearable
                                        />
                                    </div>
                                    { /* todo
                                    <div class="row">
                                        <div class="vertical-label">
                                            <div>{t("Extra Meal")} <span class="icon icon-info" /></div>
                                        </div>
                                        <FieldSwitch formik={formik}
                                            id={"extra-meal"}
                                        />
                                    </div>
                                    <div class="row">
                                        <div class="vertical-label">
                                            <div>{t("Special Request")} <span class="icon icon-info" /></div>
                                        </div>
                                        <FieldSwitch formik={formik}
                                            id={"special-request"}
                                        />
                                    </div>
                                    */ }

                                    { formik.values["special-request"] && <FieldTextarea formik={formik}
                                        id={"agent-reference"}
                                        placeholder={"Please enter your message"}
                                        label={t("Your Requests")}
                                    /> }
                                </div>

                                <div class="part">
                                    <table class="checkboxes"><tbody>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request Interconnecting Rooms"} /></td>
                                            <td><FieldCheckbox formik={formik} label={"Request for an Early Check In"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Require a Smoking Room"} /></td>
                                            <td><FieldCheckbox formik={formik} label={"Request for a Late Check Out"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Require a Non Smoking Room"} /></td>
                                            <td><FieldCheckbox formik={formik} label={"Please note that Guest is a VIP"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request Room on a Low Floor"} /></td>
                                            <td><FieldCheckbox formik={formik} label={"Please note that Guests are a Honeymoon Couple"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request Room on a High Floor"} /></td>
                                            <td><FieldCheckbox formik={formik} label={"Request for a Baby Cot"} /></td>
                                        </tr>
                                        <tr>
                                            <td class="bigger"><FieldCheckbox formik={formik} label={"Request for Late Check-In"} /></td>
                                            <td />
                                        </tr>
                                    </tbody></table>
                                </div>

                                <div class="payment method">
                                    <h2>{t("Please Select Payment Method")}</h2>
                                    <p>You need to pay: <span class="value">{store.selected.variant.currencyCode + " " + store.selected.variant.price.total}</span></p>
                                    <div class="list">
                                        <div class="item">
                                            My Site Balance <span>({store.selected.variant.currencyCode} 0.00)</span>
                                        </div>
                                        <div class="item selected">
                                            Credit/Debit Card
                                            <img src="/images/other/payments.svg" />
                                        </div>
                                    </div>
                                </div>

                                { !store.booking.result.referenceCode && !formik.isSubmitting &&
                                    <div class="final">
                                        <button type="submit" class={"button" + (formik.isValid ? "" : " disabled")}>
                                            {t("Confirm booking")}
                                        </button>
                                    </div> }

                                { formik.isSubmitting && !store.booking.result.referenceCode &&
                                    <Loader /> }

                                { store.booking.result.referenceCode &&
                                    <PaymentPage /> }

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
