import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API, dateFormat, price, plural } from "core";
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
import { Redirect } from "react-router-dom";
import { accommodationBookingValidator } from "components/form/validation";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";

@observer
class AccommodationBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToConfirmationPage: false,
            accountPaymentPossibility: false
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        store.setBookingRequest(null);
        store.setBookingResult(null);

        API.get({
            url: API.ACCOUNT_AVAILABLE,
            success: result =>
                this.setState({
                    accountPaymentPossibility: result
                })
        });
    }

    submit(values, { setSubmitting }) {
        if (!store.selected.hotel.id || !store.selected.variant.id)
            return null; //todo: another answer

        var variant = store.selected.variant,
            search = store.search.request;

        var roomDetails = [];

        for (var r = 0; r < store.search.rooms; r++) {
            var adults = store.search.request.roomDetails[r].adultsNumber,
                total = adults + store.search.request.roomDetails[r].childrenNumber,
                passengers = [];

            for (var i = 0; i < total; i++)
                passengers.push({
                    "title": values.room[r].passengers[i].title,
                    "firstName": values.room[r].passengers[i].firstName,
                    "lastName": values.room[r].passengers[i].lastName,
                    "age": 33, //todo: temporary adults workaround. correct: i < adults ? 33 : store.search.request.roomDetails[r].childrenAges[i-adults],
                    "initials":"",
                    ...( i == 0 ? {"isLeader": true} : {} )
                });

            roomDetails.push({
                type: variant.rooms[r]?.type,
                passengers
            })
        }

        var request = {
            "availabilityId": store.selected.availabilityId,
            "nationality": search.nationality,
            "paymentMethod": "CreditCard",
            "residency": search.residency,
            "mainPassengerName": roomDetails[0].passengers[0].firstName + " " + roomDetails[0].passengers[0].lastName,
            "agreementId": variant.id,
            "agentReference": values.agentReference,
            "roomDetails": roomDetails,
            "features": []
        };
        store.setBookingRequest(request);

        API.post({
            url: API.ACCOMMODATION_BOOKING,
            body: request,
            after: (result, data) => {
                store.setBookingResult(result, data);
                setSubmitting(false);
            },
            error: (error) => UI.setTopAlertText(error?.title || error?.detail || error?.message)
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
            variant = store.selected.variant,
            confirmation = store.selected.confirmation;

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

                <div class="static item" style={{ marginBottom: 0 }}>
                    {t("Your Reservation")}
                </div>
                <div class="static item no-border">
                    {variant.contractType}
                </div>
                <Dual
                    a={t("Arrival Date")}
                    b={dateFormat.a(store.search.result.checkInDate)}
                    addClass="column"
                />
                <Dual
                    a={t("Departure Date")}
                    b={dateFormat.a(store.search.result.checkOutDate)}
                    addClass="column"
                />
                <Dual
                    a={t("Number of Rooms")}
                    b={variant.rooms.length}
                />
                <Dual
                    a={t("Board Basis")}
                    b={variant.boardBasisCode == "RO" ? t("Room Only") : variant.mealPlan}
                />
                <Dual
                    a={t("Within deadline")}
                    b={dateFormat.a(confirmation.deadlineDetails.date)}
                    addClass="column"
                />

                {confirmation.deadlineDetails.remarkCodes.map( item => (
                <React.Fragment>
                    { variant.remarks[item] && <Dual
                        a={t("Remark")}
                        b={confirmation.remarks[item]}
                    /> }
                </React.Fragment>
                ))}

                {[...Array(store.search.rooms)].map((x,i)=>(
                <React.Fragment>
                    <div class="static item">{t("Room Information") + " " + (store.search.rooms > 1 ? (i+1) : '')}</div>
                    <Dual
                        a={t("Room Type")}
                        b={variant.rooms[i]?.type}
                    />
                    { /* <Dual
                        a={t("Occupancy")}
                        b={plural(t, rooms[i].adultsNumber, "Adult") + ", " + rooms[i].childrenNumber + " " + t("Children")}
                    /> */ }
                </React.Fragment>
                ))}

                <div class="static item">{t("Room & Total Cost")}</div>
                {[...Array(store.search.rooms)].map((x,i)=>(
                (variant.rooms[i].roomPrices?.[0].nett !== undefined && "Room" == variant.rooms[i].roomPrices?.[0].type) ?
                <Dual
                    a={t("Room Cost") + " " + (store.search.rooms > 1 ? (i+1) : '')}
                    b={price(variant.currencyCode, variant.rooms[i].roomPrices[0].nett)}
                /> : null
                ))}
                <Dual
                    a={t("Total Cost")}
                    b={price(variant.currencyCode, variant.price.total)}
                />
                <div class="total-cost">
                    <div>{t("Reservation Total Cost")}</div>
                    <div>{price(variant.currencyCode, variant.price.total)}</div>
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

                <Formik
                    initialValues={{
                        room: [...Array(store.search.rooms)].map((x,r) => ({
                            passengers: [
                                ...Array(store.search.request.roomDetails[r].adultsNumber),
                                ...Array(store.search.request.roomDetails[r].childrenNumber),
                            ]
                        }))
                    }}
                    validationSchema={accommodationBookingValidator}
                    onSubmit={this.submit}
                    render={formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <div class="form">
                                <FieldArray
                                    render={() => (
                                formik.values.room.map((item, r) => {
                                    var adults = store.search.request.roomDetails[r].adultsNumber,
                                        childrenAges = store.search.request.roomDetails[r].childrenAges;
                                return (
                                <React.Fragment>
                                <h2>
                                    <span>Room {r+1}:</span> {variant.rooms[r]?.type}
                                </h2>
                                <div class="part">
                                    <table class="people"><tbody>
                                        <tr>
                                            <th><span class="required">{t("Title")}</span></th>
                                            <th><span class="required">{t("First Name")}</span></th>
                                            <th><span class="required">{t("Last Name")}</span></th>
                                        </tr>

                                        <FieldArray
                                            render={() => (
                                        <React.Fragment>
                                            {formik.values.room[r].passengers.map((item, index) => (
                                            <tr>
                                                <td>
                                                    <FieldSelect formik={formik}
                                                        id={`room.${r}.passengers.${index}.title`}
                                                        placeholder={index < adults ?
                                                            t("Please select one") :
                                                            t("Child") // + ", " + plural(t, childrenAges[index - adults], "year")
                                                        }
                                                        options={[
                                                            { value: "Mr", text: t("Mr.")},
                                                            { value: "Ms", text: t("Ms.")},
                                                            { value: "Miss", text: t("Miss.")},
                                                            { value: "Mrs", text: t("Mrs.")}
                                                        ]}
                                                    />
                                                </td>
                                                <td class="bigger">
                                                    <FieldText formik={formik}
                                                        id={`room.${r}.passengers.${index}.firstName`}
                                                        placeholder={t("Please enter first name")}
                                                        clearable
                                                    />
                                                </td>
                                                <td class="bigger">
                                                    <FieldText formik={formik}
                                                        id={`room.${r}.passengers.${index}.lastName`}
                                                        placeholder={t("Please enter last name")}
                                                        clearable
                                                    />
                                                </td>
                                            </tr>))}
                                        </React.Fragment>
                                        )} />
                                    </tbody></table>
                                </div>
                                </React.Fragment>)}))} />

                                { /* todo
                                <div class="part">
                                    <div class="row no-margin">
                                        <div class="vertical-label">{t("Agent Reference")}</div>
                                        <FieldText formik={formik}
                                            id={"agent-reference"}
                                            placeholder={t("Please enter here")}
                                            clearable
                                        />
                                    </div>
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

                                    <FieldTextarea formik={formik}
                                        id="agentReference"
                                        placeholder={"Please enter your message"}
                                        label={t("Special Request")}
                                    />
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
                                </div> */ }

                                <div class="payment method">
                                    <h2>{t("Please Select Payment Method")}</h2>
                                    <p>{t("You need to pay")}:
                                        <span class="value">{price(store.selected.variant.currencyCode, store.selected.variant.price.total)}</span>
                                    </p>
                                    <div class="list">
                                        <div class={"item " + (this.state.accountPaymentPossibility ? "" : " disabled")}>
                                            <span class="icon icon-radio" />
                                            {t("My Site Balance")}
                                            <span>{price(store.selected.variant.currencyCode, 0)}</span>
                                        </div>
                                        <div class="item selected">
                                            <span class="icon icon-radio on" />
                                            {t("Credit/Debit Card")}
                                            <img src="/images/other/visa.png" />
                                            <img src="/images/other/mc.png" />
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
                                    <Redirect to="/payment/form" /> }

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
