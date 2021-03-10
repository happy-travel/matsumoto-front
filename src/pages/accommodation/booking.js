import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API, redirect } from "core";
import { FieldArray } from "formik";
import { Dual, Loader, MealPlan, RoomPrices, GroupRoomTypesAndCount, date, price } from "simple";
import { CachedForm, FORM_NAMES, FieldText, FieldCheckbox, FieldSelect } from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Link } from "react-router-dom";
import { accommodationBookingValidator } from "components/form/validation";
import FullDeadline from "components/full-deadline";
import transliterate from "components/external/transliterate";
import { PAYMENT_METHODS } from "enum";
import store from "stores/accommodation-store";
import paymentStore from "stores/payment-store";
import Notifications from "stores/notifications-store";
import authStore, { APR_VALUES } from "stores/auth-store";

@observer
class AccommodationBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availablePayments: "CreditCardAndBankTransfer"
        };
        this.submit = this.submit.bind(this);
        this.isAccountPaymentAvailable = this.isAccountPaymentAvailable.bind(this);
    }

    componentDidMount() {
        store.setBookingRequest(null);
        API.get({
            url: API.AGENCY_PAYMENT_OPTION,
            success: availablePayments => this.setState({ availablePayments })
        });
        API.get({
            url: API.ACCOUNT_BALANCE("USD"),
            success: balance => authStore.setBalance(balance)
        });
        API.get({
            url: API.COUNTERPARTY_INFO,
            success: counterparty => paymentStore.setPaymentMethod(counterparty.preferredPaymentMethod)
        });
    }

    submit(values, { setSubmitting }) {
        if (!store.selected?.accommodationFinal?.accommodation?.id) {
            setSubmitting(false);
            Notifications.addNotification("Booking unsuccessful, please try again later or contact us for help.");
            return null;
        }

        var contract = store.selected.roomContractSet,
            search = store.search.request;

        var roomDetails = [];

        for (var r = 0; r < contract?.rooms?.length; r++) {
            var adults = contract?.rooms[r]?.adultsNumber,
                total = adults + contract?.rooms[r]?.childrenAges.length,
                passengers = [];

            for (var i = 0; i < total; i++)
                passengers.push({
                    title: values.room[r].passengers[i].title,
                    firstName: values.room[r].passengers[i].firstName,
                    lastName: values.room[r].passengers[i].lastName,
                    age: i < adults ? 33 : (contract?.rooms[r]?.childrenAges[i-adults] || 12),
                    ...( i == 0 ? { isLeader: true } : {} )
                });

            roomDetails.push({
                type: contract.rooms[r]?.type,
                passengers
            })
        }

        var request = {
            searchId: store.search.id,
            resultId: store.selected.accommodation.id,
            roomContractSetId: contract.id,
            nationality: search.nationality,
            paymentMethod: paymentStore.paymentMethod,
            residency: search.residency,
            mainPassengerName: roomDetails[0].passengers[0].firstName + " " + roomDetails[0].passengers[0].lastName,
            agentReference: values.agentReference,
            roomDetails: roomDetails,
            features: [],
            itineraryNumber: values.itineraryNumber,
            supplier: store.selected.accommodation.source
        };
        store.setBookingRequest(request);

        var error = err => {
                Notifications.addNotification(err?.title || err?.detail || err?.message);
                setSubmitting(false);
            };

        if (paymentStore.paymentMethod == PAYMENT_METHODS.ACCOUNT)
            API.post({
                url: API.BOOK_BY_ACCOUNT,
                body: request,
                success: result => {
                    if (!result?.bookingDetails?.referenceCode) {
                        Notifications.addNotification("Error occurred during account payment");
                        return;
                    }
                    paymentStore.setPaymentResult(null);
                    paymentStore.setSubject(result.bookingDetails.referenceCode);
                    redirect("/accommodation/confirmation");
                },
                error
            });

        if (paymentStore.paymentMethod == PAYMENT_METHODS.CARD)
            API.post({
                url: API.ACCOMMODATION_BOOKING,
                body: request,
                success: result => {
                    paymentStore.setSubject(result, store.selected.roomContractSet.rate.finalPrice);
                    redirect("/payment/form");
                },
                error
            });
    }

    isAccountPaymentAvailable() {
        var balance = authStore.balance,
            APR = store.selected.roomContractSet?.isAdvancePurchaseRate;

        var result = (
            balance?.currency &&
            (balance.balance >= 0) &&
            !(APR && (authStore.agencyAPR < APR_VALUES.CardAndAccountPurchases)) &&
            (this.state.availablePayments != 'CreditCard')
        );

        if (!result && (PAYMENT_METHODS.ACCOUNT == paymentStore.paymentMethod))
            paymentStore.setPaymentMethod(PAYMENT_METHODS.CARD);

        return result;
    }

    render() {
        const { t } = useTranslation();

        if (!store.selected?.accommodationFinal?.accommodation?.id)
            return null; //todo: another answer

        var hotel = store.selected.accommodationFinal.accommodation,
            baseInfo = store.selected.accommodationFinal,
            contract = store.selected.roomContractSet,

            initialValues = {
                room: contract?.rooms?.map(item => ({
                    passengers: [
                        ...Array(item?.adultsNumber),
                        ...Array(item?.childrenAges.length),
                    ]
                })) || [],
                accepted: true,
                itineraryNumber: '',
            };

        if (!contract)
            return null;

        return (
<div className="booking block">
    <div className="hide">{paymentStore.paymentMethod}{authStore.balance?.balance}</div>
    <section className="double-sections">
        <div className="left-section filters">
            <div className="static item">{t("Booking Summary")}</div>
            { hotel.photo.sourceUrl && <div className="expanded">
                <img src={hotel.photo.sourceUrl} alt={hotel.photo.caption} className="round" />
            </div> }
            <div className="static item no-border">
                {hotel.name}
            </div>
            <div className="subtitle">
                {hotel.location.address}
                , {hotel.location.locality}
                , {hotel.location.country}
            </div>
            {contract.supplier && <div className="subtitle">
                Supplier: {" " + contract.supplier}
            </div>}
            { !!contract.tags?.length &&
                <div className="black">
                    { contract.tags?.includes("direct-connectivity") &&
                        <strong>
                            Direct Connectivity
                        </strong>
                    }
                </div>
            }

            <div className="static item">
                {t("Your Reservation")}
            </div>
            <Dual className="column"
                a={t("Arrival Date")}
                b={date.format.a(baseInfo.checkInDate)}
            />
            <Dual className="column"
                a={t("Departure Date")}
                b={date.format.a(baseInfo.checkOutDate)}
            />
            <div className="dual" style={{display: "inline-block"}}>
                <span className="first">{t("Number of Rooms")}</span>
                <span className="second">{contract.rooms.length}</span>
            </div>

            <div className="static item">{t("Room & Total Cost")}</div>
                {contract?.rooms?.map((rc, i) => (
                    (rc.roomPrices?.[0].finalPrice !== undefined) ?
                    <Dual
                        className={__class(rc.roomPrices.length > 1, "column")}
                        a={t("Room Cost") + (contract?.rooms?.length > 1 ? (" " + (i+1)) : '')}
                        b={ <RoomPrices t={t} prices={contract.rooms[i].roomPrices} /> }
                        key={i}
                    /> : null
                ))}
            <div className="total-cost">
                <div>{t("Reservation Total Cost")}</div>
                <div>{price(contract.rate.finalPrice)}</div>
            </div>
        </div>
        <div className="right-section">
            <Breadcrumbs items={[
                {
                    text: t("Search Accommodations"),
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
                items={[t("Search Accommodations"), t("Guest Details"), t("Booking Confirmation")]}
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
                    <>
                        <div className="form">
                            <FieldArray
                                render={() => (
                            contract?.rooms.map((item, r) => <React.Fragment key={r}>
                            <h2>
                                <span>
                                    Room {r+1}:
                                </span> <GroupRoomTypesAndCount solo t={t} contracts={[item]} />
                            </h2>
                            <div className="part">
                                <table className="people"><tbody>
                                    <tr>
                                        <th><span className="required">{t("Title")}</span></th>
                                        <th><span className="required">{t("First Name")}</span></th>
                                        <th><span className="required">{t("Last Name")}</span></th>
                                    </tr>
                                    <FieldArray
                                        render={
                                    () => formik.values.room[r].passengers.map((passengers, index) => (
                                        <tr key={index}>
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
                                            <td className="bigger">
                                                <FieldText formik={formik}
                                                    id={`room.${r}.passengers.${index}.firstName`}
                                                    placeholder={t("Please enter first name")}
                                                    onChange={transliterate}
                                                    clearable
                                                />
                                            </td>
                                            <td className="bigger">
                                                <FieldText formik={formik}
                                                    id={`room.${r}.passengers.${index}.lastName`}
                                                    placeholder={t("Please enter last name")}
                                                    onChange={transliterate}
                                                    clearable
                                                />
                                            </td>
                                        </tr>
                                    ))} />
                                </tbody></table>

                                <p className="remark">
                                    {t("Board Basis")}: <MealPlan t={t} room={contract.rooms[0]} />
                                </p>

                                <FullDeadline t={t}
                                              deadline={item.deadline}
                                              remarks={item.remarks}
                                />
                            </div>
                            </React.Fragment>))} />

                            <div className="part" style={{ margin: "-10px 0 5px" }}>
                                <div className="row">
                                    <div className="vertical-label left">{t("Itinerary number")}</div>
                                    <FieldText formik={formik}
                                               id={"itineraryNumber"}
                                               placeholder={t("Please enter itinerary number")}
                                               clearable
                                               className={"size-medium"}
                                    />
                                </div>
                            </div>

                            <div className="payment method">
                                <h2>{t("Please Select Payment Method")}</h2>
                                { !!contract.priceChangedAlert && <div className="accent-frame information warn alternative-margin">
                                    <div className="before">
                                        <span className="icon icon-warning-yellow" />
                                    </div>
                                    <div className="data">
                                        <b>
                                            {t("Please note the booking price has changed.")}
                                        </b>
                                        <div>
                                            {t("To speed up a search on a large number of accommodations, we use preloaded data. Sometimes the data may become outdated while you work with the site. When this happens, you may see a change in price or in cancellation policies on this screen. The last shown price is final.")}
                                        </div>
                                    </div>
                                </div>}
                                <p>{t("You need to pay")}:
                                    <span className="value"><b>{price(contract.rate.finalPrice)}</b></span>
                                </p>
                                { contract?.isAdvancePurchaseRate &&
                                    <h3 style={{margin: "20px 0 -20px"}}>
                                        <span className="restricted-rate">
                                            {t("Restricted Rate")}
                                        </span>
                                    </h3>
                                }
                                <div className="list">
                                    { this.isAccountPaymentAvailable() &&
                                        <div
                                            className={"item" +
                                                __class(PAYMENT_METHODS.ACCOUNT == paymentStore.paymentMethod, "selected")
                                            }
                                            onClick={() => paymentStore.setPaymentMethod(PAYMENT_METHODS.ACCOUNT)}
                                        >
                                            <span className="icon icon-radio" />
                                            {t("Account balance")} {(authStore.settings.availableCredit === true) &&
                                                <span>{"(" + price(authStore.balance?.currency, authStore.balance?.balance).trim() + ")"}</span>}
                                        </div>
                                    }
                                    <div
                                        className={"item" +
                                            __class(PAYMENT_METHODS.CARD == paymentStore.paymentMethod, "selected")
                                        }
                                        onClick={() => paymentStore.setPaymentMethod(PAYMENT_METHODS.CARD)}
                                    >
                                        <span className="icon icon-radio" />
                                        {t("Credit or Debit Card")}
                                        <img src="/images/other/visa.png" alt="" />
                                        <img src="/images/other/mc.png" alt="" />
                                    </div>
                                </div>
                            </div>

                            <div className="final">
                                <div className="dual">
                                    <div className="first">
                                        <FieldCheckbox formik={formik}
                                            id={"accepted"}
                                            label={<div>
                                                {t("I have read and accepted the booking")} <Link target="_blank" to="/terms" className="underlined link">{t("Terms & Conditions")}</Link>
                                            </div>}
                                        />
                                    </div>
                                    {!(contract?.isAdvancePurchaseRate &&
                                        (authStore.agencyAPR < APR_VALUES.CardPurchasesOnly)) &&
                                        <div className="second">
                                            <button type="submit" className={"button" + __class(!formik.isValid, "disabled")}>
                                                {t("Confirm booking")}
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>

                            { formik.isSubmitting &&
                                <Loader page />
                            }
                        </div>
                    </>
                )}
            />
        </div>
    </section>
</div>
    );
}
}

export default AccommodationBookingPage;
