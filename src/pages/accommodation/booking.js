import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API, dateFormat, price, plural } from "core";
import { FieldArray } from "formik";

import {
    CachedForm,
    FORM_NAMES,
    FieldText,
    FieldTextarea,
    FieldSwitch,
    FieldCheckbox,
    FieldSelect
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual, Loader } from "components/simple";
import { Link, Redirect } from "react-router-dom";
import { accommodationBookingValidator } from "components/form/validation";

import store, { PAYMENT_METHODS } from "stores/accommodation-store";
import View from "stores/view-store";

const isPaymentAvailable = (balance, price) =>
   ( balance?.currency && (balance.balance >= balance.creditLimit) );

@observer
class AccommodationBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: false
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        store.setBookingRequest(null);
        store.setBookingReferenceCode(null);
        store.setPaymentMethod(PAYMENT_METHODS.CARD);

        API.get({
            url: API.ACCOUNT_BALANCE("USD"),
            success: result =>
                this.setState({
                    balance: result
                })
        });
    }

    componentWillUnmount() {
        store.selectRoomContractSet(null);
    }

    submit(values, { setSubmitting }) {
        if (!store.selected?.accommodationFinal?.accommodationDetails?.id)
            return null; //todo: another answer

        var variant = store.selected.roomContractSet,
            search = store.search.request;

        var roomDetails = [];

        for (var r = 0; r < variant?.roomContracts?.length; r++) {
            var adults = variant?.roomContracts[r]?.adultsNumber,
                total = adults + variant?.roomContracts[r]?.childrenNumber,
                passengers = [];

            for (var i = 0; i < total; i++)
                passengers.push({
                    "title": values.room[r].passengers[i].title,
                    "firstName": values.room[r].passengers[i].firstName,
                    "lastName": values.room[r].passengers[i].lastName,
                    "age": i < adults ? 33 : (store.search.request.roomDetails[r].childrenAges[i-adults] || 12),
                    ...( i == 0 ? {"isLeader": true} : {} )
                });

            roomDetails.push({
                type: variant.roomContracts[r]?.type,
                passengers
            })
        }

        var request = {
            "availabilityId": store.selected.availabilityId,
            "nationality": search.nationality,
            "paymentMethod": store.paymentMethod,
            "residency": search.residency,
            "mainPassengerName": roomDetails[0].passengers[0].firstName + " " + roomDetails[0].passengers[0].lastName,
            "roomContractSetId": variant.id,
            "agentReference": values.agentReference,
            "roomDetails": roomDetails,
            "features": [],
            "itineraryNumber": values.itineraryNumber,
            "dataProvider": store.selected.accommodation.source
        };
        store.setBookingRequest(request);

        API.post({
            url: API.ACCOMMODATION_BOOKING,
            body: request,
            after: (result) => {
                store.setBookingReferenceCode(result);
                setSubmitting(false);
            },
            error: (error) => View.setTopAlertText(error?.title || error?.detail || error?.message)
        });
    }

    render() {
        const { t } = useTranslation();

        if (!store.selected?.accommodationFinal?.accommodationDetails?.id)
            return null; //todo: another answer

        var hotel = store.selected.accommodationFinal.accommodationDetails,
            baseInfo = store.selected.accommodationFinal,
            variant = store.selected.roomContractSet,
            deadlineDetails = store.selected.deadlineDetails,

            initialValues = {
                room: variant?.roomContracts?.map((x,r) => ({
                    passengers: [
                        ...Array(variant?.roomContracts[r]?.adultsNumber),
                        ...Array(variant?.roomContracts[r]?.childrenNumber),
                    ]
                })) || [],
                accepted: true,
                itineraryNumber: '',
            };

        if (!variant || !deadlineDetails)
            return null;

        return (

<React.Fragment>
    <div class="booking block">
        <div class="hide">{store.paymentMethod}</div>
        <section class="double-sections">
            <div class="left-section filters">
                <div class="static item">{t("Booking Summary")}</div>
                { hotel.pictures?.[0]?.source && <div class="expanded">
                    <img src={hotel.pictures[0].source} alt={hotel.pictures[0].caption} class="round" />
                </div> }
                <div class="static item no-border">
                    {hotel.name}
                </div>
                <div class="subtitle">
                    {hotel.location.address}
                    , {hotel.location.locality}
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
                    b={dateFormat.a(baseInfo.checkInDate)}
                    addClass="column"
                />
                <Dual
                    a={t("Departure Date")}
                    b={dateFormat.a(baseInfo.checkOutDate)}
                    addClass="column"
                />
                <Dual
                    a={t("Number of Rooms")}
                    b={variant.roomContracts.length}
                />
                <Dual
                    a={t("Board Basis")}
                    b={variant.roomContracts[0].boardBasisCode + ": " + ("RO" == variant.roomContracts[0].boardBasisCode ? t("Room Only") : variant.roomContracts[0].mealPlan)}
                />

                { /* deadlineDetails.remarkCodes.map( item => (
                <React.Fragment>
                    { variant.remarks[item] && <Dual
                        a={t("Remark")}
                        b={variant.remarks[item]}
                    /> }
                </React.Fragment>
                )) */ }

                {variant?.roomContracts?.map((x,i)=>(
                <React.Fragment>
                    <div class="static item">{t("Room Information") + " " + (variant?.roomContracts?.length > 1 ? (i+1) : '')}</div>
                    <Dual
                        a={t("Room Type")}
                        b={variant.roomContracts[i]?.type}
                    />
                    { /* <Dual
                        a={t("Occupancy")}
                        b={plural(t, roomContracts[i].adultsNumber, "Adult") + ", " + roomContracts[i].childrenNumber + " " + t("Children")}
                    /> */ }
                </React.Fragment>
                ))}

                <div class="static item">{t("Room & Total Cost")}</div>
                {variant?.roomContracts?.map((x,i)=>(
                (variant?.roomContracts[i]?.roomPrices?.[0].netTotal !== undefined && "Room" == variant?.roomContracts[i]?.roomPrices?.[0].type) ?
                <Dual
                    a={t("Room Cost") + " " + (variant?.roomContracts?.length > 1 ? (i+1) : '')}
                    b={price(variant.roomContracts[i].roomPrices[0])}
                /> : null
                ))}
                <Dual
                    a={t("Total Cost")}
                    b={price(variant.price)}
                />
                <div class="total-cost">
                    <div>{t("Reservation Total Cost")}</div>
                    <div>{price(variant.price)}</div>
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

                <CachedForm
                    id={ FORM_NAMES.BookingForm }
                    cacheValidator ={ cache => {
                        if (cache?.room?.length != initialValues?.room.length)
                            return false;
                        for (var i = 0; i < initialValues?.room.length; i++)
                            if (cache?.room?.[i]?.passengers?.length != initialValues?.room[i].passengers.length)
                                return false;

                        // todo: age validation is needed in future
                        return true;
                    }}
                    initialValues={initialValues}
                    validationSchema={accommodationBookingValidator}
                    onSubmit={this.submit}
                    render={formik => (
                        <React.Fragment>
                            <div class="form">
                                <FieldArray
                                    render={() => (
                                formik.values.room.map((item, r) => {
                                    var adults = variant?.roomContracts[r]?.adultsNumber,
                                        childrenAges = variant?.roomContracts[r]?.childrenAges;
                                return (
                                <React.Fragment>
                                <h2>
                                    <span>Room {r+1}:</span> {variant.roomContracts[r]?.type}
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
                                                            { value: "Miss", text: t("Miss")},
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

                                <div class="part" style={{marginTop: "6px"}}>
                                    <h3 style={{marginBottom: "24px"}}>{t("Additional Information")}</h3>
                                    <p class="remark">
                                        {
                                            deadlineDetails.date ?
                                            <span>
                                                {t("Cancellation Deadline")}: {dateFormat.a(deadlineDetails.date)}
                                            </span>:
                                            <span class="info green">
                                                {t("FREE Cancellation - Without Prepayment")}
                                            </span>
                                        }
                                    </p>

                                    <p class="remark">
                                        {(deadlineDetails.policies || []).map(item => (<React.Fragment>
                                            {t("From")} {dateFormat.a(item.fromDate)} {t("cancellation costs you")} {item.percentage}% {t("of total amount")}.<br/>
                                        </React.Fragment>))}
                                    </p>

                                    {Object.keys(variant.remarks || {}).map(key => (
                                        <p class="remark">{variant.remarks[key]}</p>
                                    ))}
                                </div>

                                <div class="part" style={{ paddingBottom: "5px", marginTop: "-4px" }}>
                                    <div class="row no-margin">
                                        <div class="vertical-label">{t("Itinerary number")}</div>
                                        <FieldText formik={formik}
                                                   id={"itineraryNumber"}
                                                   placeholder={t("Please enter itinerary number")}
                                                   clearable
                                                   addClass={"size-medium"}
                                        />
                                    </div>
                                </div>

                                <div class="payment method">
                                    <h2>{t("Please Select Payment Method")}</h2>
                                    <p>{t("You need to pay")}:
                                        <span class="value">{price(variant.price)}</span>
                                    </p>
                                    <div class="list">
                                        <div
                                            class={"item"
                                                    + (isPaymentAvailable(this.state.balance) ? "" : " disabled")
                                                    + (PAYMENT_METHODS.ACCOUNT == store.paymentMethod ? " selected" : "")
                                            }
                                            onClick={isPaymentAvailable(this.state.balance)
                                                ? () => store.setPaymentMethod(PAYMENT_METHODS.ACCOUNT)
                                                : () => {}}
                                        >
                                            <span class="icon icon-radio" />
                                            {t("Account")}. {price(this.state.balance.currency, this.state.balance.balance)}
                                        </div>
                                        <div
                                            class={"item"
                                                    + (PAYMENT_METHODS.CARD == store.paymentMethod ? " selected" : "")
                                            }
                                            onClick={() => store.setPaymentMethod(PAYMENT_METHODS.CARD)}
                                        >
                                            <span class="icon icon-radio" />
                                            {t("Credit/Debit Card")}
                                            <img src="/images/other/visa.png" />
                                            <img src="/images/other/mc.png" />
                                        </div>
                                    </div>
                                </div>

                                <div class="final">
                                    <div class="dual">
                                        <div class="first">
                                            <FieldCheckbox formik={formik}
                                                id={"accepted"}
                                                label={<div>
                                                    {t("I have read and accepted the booking")} <Link target="_blank" to="/terms" class="underlined link">{t("Terms & Conditions")}</Link>
                                                </div>}
                                            />
                                        </div>
                                        <div class="second">
                                            <button type="submit" class={"button" + (formik.isValid ? "" : " disabled")}>
                                                {t("Confirm booking")}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                { formik.isSubmitting && !store.booking.referenceCode &&
                                    <Loader page /> }

                                { store.booking.referenceCode && (store.paymentMethod == PAYMENT_METHODS.CARD) &&
                                    <Redirect push to="/payment/form" /> }

                                { store.booking.referenceCode && (store.paymentMethod == PAYMENT_METHODS.ACCOUNT) &&
                                    <Redirect push to="/payment/account" /> }

                            </div>
                        </React.Fragment>
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
