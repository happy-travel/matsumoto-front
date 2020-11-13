import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API } from "core";
import { FieldArray } from "formik";

import {
    Dual, Loader, MealPlan, RoomPrices, GroupRoomTypesAndCount, dateFormat, price
} from "simple";
import {
    CachedForm,
    FORM_NAMES,
    FieldText,
    FieldCheckbox,
    FieldSelect
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Link, Redirect } from "react-router-dom";
import { accommodationBookingValidator } from "components/form/validation";
import FullDeadline from "components/full-deadline";
import transliterate from "components/external/transliterate";

import store, { PAYMENT_METHODS } from "stores/accommodation-store";
import View from "stores/view-store";
import authStore, { APR_VALUES } from "stores/auth-store";

const isPaymentAvailable = (balance, APR) => (
    balance?.currency && (balance.balance >= 0) && !(APR && (authStore.agencyAPR < APR_VALUES.CardAndAccountPurchases))
);

@observer
class AccommodationBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToPayment: false
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        store.setBookingRequest(null);
        store.setBookingReferenceCode(null);
        store.setPaymentMethod(PAYMENT_METHODS.CARD);
        store.setBookingToPay(null);

        API.get({
            url: API.ACCOUNT_BALANCE("USD"),
            success: balance => authStore.setBalance(balance)
        });
    }

    submit(values, { setSubmitting }) {
        if (!store.selected?.accommodationFinal?.accommodation?.id) {
            setSubmitting(false);
            View.setTopAlertText("Booking unsuccessful, please try again later or contact us for help.");
            return null;
        }

        var variant = store.selected.roomContractSet,
            search = store.search.request;

        var roomDetails = [];

        for (var r = 0; r < variant?.rooms?.length; r++) {
            var adults = variant?.rooms[r]?.adultsNumber,
                total = adults + variant?.rooms[r]?.childrenAges.length,
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
                type: variant.rooms[r]?.type,
                passengers
            })
        }

        var request = {
            "searchId": store.search.id,
            "resultId": store.selected.accommodation.id,
            "roomContractSetId": variant.id,
            "nationality": search.nationality,
            "paymentMethod": store.paymentMethod,
            "residency": search.residency,
            "mainPassengerName": roomDetails[0].passengers[0].firstName + " " + roomDetails[0].passengers[0].lastName,
            "agentReference": values.agentReference,
            "roomDetails": roomDetails,
            "features": [],
            "itineraryNumber": values.itineraryNumber,
            "supplier": store.selected.accommodation.source
        };
        store.setBookingRequest(request);

        var error = err => View.setTopAlertText(err?.title || err?.detail || err?.message),
            after = () => setSubmitting(false);

        if (store.paymentMethod == PAYMENT_METHODS.ACCOUNT)
            API.post({
                url: API.BOOK_BY_ACCOUNT,
                body: request,
                success: result => {
                    store.setBookingReferenceCode(result);
                    if (result?.bookingDetails?.referenceCode) {
                        store.setPaymentResult({
                            params: {
                                referenceCode: result.bookingDetails.referenceCode
                            },
                            result: {
                                status: result.paymentStatus
                            }
                        });
                        this.setState({ redirect: "/accommodation/confirmation" });
                    }
                    else
                        View.setTopAlertText("Error occurred during account payment")
                },
                after,
                error
            });

        if (store.paymentMethod == PAYMENT_METHODS.CARD)
            API.post({
                url: API.ACCOMMODATION_BOOKING,
                body: request,
                success: result => {
                    store.setBookingReferenceCode(result);
                    this.setState({ redirect: "/payment/form" });
                },
                after,
                error
            });
    }

    render() {
        const { t } = useTranslation();

        if (!store.selected?.accommodationFinal?.accommodation?.id)
            return null; //todo: another answer

        var hotel = store.selected.accommodationFinal.accommodation,
            baseInfo = store.selected.accommodationFinal,
            variant = store.selected.roomContractSet,

            initialValues = {
                room: variant?.rooms?.map(item => ({
                    passengers: [
                        ...Array(item?.adultsNumber),
                        ...Array(item?.childrenAges.length),
                    ]
                })) || [],
                accepted: true,
                itineraryNumber: '',
            };

        if (!variant)
            return null;


        if (this.state.redirect)
            return <Redirect push to={this.state.redirect}/>;

        return (

<React.Fragment>
    <div class="booking block">
        <div class="hide">{store.paymentMethod}{authStore.balance?.balance}</div>
        <section class="double-sections">
            <div class="left-section filters">
                <div class="static item">{t("Booking Summary")}</div>
                { hotel.photo.sourceUrl && <div class="expanded">
                    <img src={hotel.photo.sourceUrl} alt={hotel.photo.caption} class="round" />
                </div> }
                <div class="static item no-border">
                    {hotel.name}
                </div>
                <div class="subtitle">
                    {hotel.location.address}
                    , {hotel.location.locality}
                    , {hotel.location.country}
                </div>
                {variant.supplier && <div class="subtitle">
                    Supplier: {" " + variant.supplier}
                </div>}

                <div class="static item">
                    {t("Your Reservation")}
                </div>
                <Dual addClass="column"
                    a={t("Arrival Date")}
                    b={dateFormat.a(baseInfo.checkInDate)}
                />
                <Dual addClass="column"
                    a={t("Departure Date")}
                    b={dateFormat.a(baseInfo.checkOutDate)}
                />
                <div class="dual" style={{display: "inline-block"}}>
                    <span class="first">{t("Number of Rooms")}</span>
                    <span class="second">{variant.rooms.length}</span>
                </div>

                <div class="static item">{t("Room & Total Cost")}</div>
                    {variant?.rooms?.map((rc,i) => (
                        (rc.roomPrices?.[0].netTotal !== undefined) ?
                        <Dual addClass={__class(rc.roomPrices.length > 1, "column")}
                            a={t("Room Cost") + (variant?.rooms?.length > 1 ? (" " + (i+1)) : '')}
                            b={ <RoomPrices t={t} prices={variant.rooms[i].roomPrices} /> }
                        /> : null
                    ))}
                <div class="total-cost">
                    <div>{t("Reservation Total Cost")}</div>
                    <div>{price(variant.price.netTotal)}</div>
                </div>
            </div>
            <div class="right-section">
                <Breadcrumbs items={[
                    {
                        text: t("Search accommodation"),
                        link: "/"
                    }, {
                        text: hotel.location.locality + ", " + hotel.location.country,
                        link: "/search"
                    }, {
                        text: hotel.name,
                        link: "/search/contract"
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
                    cacheValidator={ cache => {
                        if (cache?.room?.length != initialValues?.room.length)
                            return false;
                        for (var i = 0; i < initialValues?.room.length; i++)
                            if (cache?.room?.[i]?.passengers?.length != initialValues?.room[i].passengers.length)
                                return false;
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
                                variant?.rooms.map((item, r) => <React.Fragment>
                                <h2>
                                    <span>
                                        Room {r+1}:
                                    </span> <GroupRoomTypesAndCount solo t={t} contracts={[item]} />
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
                                            {formik.values.room[r].passengers.map((passengers, index) => (
                                            <tr>
                                                <td>
                                                    <FieldSelect formik={formik}
                                                        id={`room.${r}.passengers.${index}.title`}
                                                        placeholder={index < item.adultsNumber ?
                                                            t("Please select one") :
                                                            t("Child") // + ", " + __plural(t, childrenAges[index - adults], "year")
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
                                                        onChange={transliterate}
                                                        clearable
                                                    />
                                                </td>
                                                <td class="bigger">
                                                    <FieldText formik={formik}
                                                        id={`room.${r}.passengers.${index}.lastName`}
                                                        placeholder={t("Please enter last name")}
                                                        onChange={transliterate}
                                                        clearable
                                                    />
                                                </td>
                                            </tr>))}
                                        </React.Fragment>
                                        )} />
                                    </tbody></table>

                                    <p class="remark">
                                        {t("Board Basis")}: <MealPlan t={t} room={variant.rooms[0]} />
                                    </p>

                                    <FullDeadline t={t}
                                                  deadline={item.deadline}
                                                  remarks={item.remarks}
                                    />
                                </div>
                                </React.Fragment>))} />

                                <div class="part" style={{ margin: "-10px 0 5px" }}>
                                    <div class="row">
                                        <div class="vertical-label left">{t("Itinerary number")}</div>
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
                                    { !!variant.priceChangedAlert && <div class="accent-frame information warn alternative-margin">
                                        <div class="before">
                                            <span class="icon icon-warning-yellow" />
                                        </div>
                                        <div class="data">
                                            <b>
                                                {t("Please note the booking price has changed.")}
                                            </b>
                                            <div>
                                                {t("To speed up a search on a large number of accommodations, we use a preloaded data. Sometimes the data may become outdated while you work with the site. When this happens, you can see a change in price or in cancellation policies on this screen. The shown price is final.")}
                                            </div>
                                        </div>
                                    </div>}
                                    <p>{t("You need to pay")}:
                                        <span class="value"><b>{price(variant.price.netTotal)}</b></span>
                                    </p>
                                    { variant?.rooms?.[0].isAdvancedPurchaseRate &&
                                        <h3 style={{margin: "20px 0 -20px"}}>
                                            <span class="restricted-rate">
                                                {t("Restricted Rate")}
                                            </span>
                                        </h3>
                                    }
                                    <div class="list">
                                        <div
                                            class={"item" +
                                                __class(!isPaymentAvailable(authStore.balance, variant?.rooms?.[0].isAdvancedPurchaseRate), "disabled") +
                                                __class(PAYMENT_METHODS.ACCOUNT == store.paymentMethod, "selected")
                                            }
                                            onClick={isPaymentAvailable(authStore.balance, variant?.rooms?.[0].isAdvancedPurchaseRate)
                                                ? () => store.setPaymentMethod(PAYMENT_METHODS.ACCOUNT)
                                                : () => {}}
                                        >
                                            <span class="icon icon-radio" />
                                            {t("Account balance")} {(authStore.settings.availableCredit === true) &&
                                                <span>{"(" + price(authStore.balance?.currency, authStore.balance?.balance).trim() + ")"}</span>}
                                        </div>
                                        <div
                                            class={"item" +
                                                __class(PAYMENT_METHODS.CARD == store.paymentMethod, "selected")
                                            }
                                            onClick={() => store.setPaymentMethod(PAYMENT_METHODS.CARD)}
                                        >
                                            <span class="icon icon-radio" />
                                            {t("Credit or Debit Card")}
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
                                        {!(variant?.rooms[0].isAdvancedPurchaseRate &&
                                            (authStore.agencyAPR < APR_VALUES.CardPurchasesOnly)) &&
                                            <div class="second">
                                                <button type="submit" class={"button" + __class(!formik.isValid, "disabled")}>
                                                    {t("Confirm booking")}
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>

                                { formik.isSubmitting && !this.state.redirect &&
                                    <Loader page /> }
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
