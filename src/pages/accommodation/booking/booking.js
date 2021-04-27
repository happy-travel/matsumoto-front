import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { FieldArray } from "formik";
import { GroupRoomTypesAndCount, price } from "simple";
import { Loader } from "components/simple";
import { CachedForm, FORM_NAMES, FieldText, FieldCheckbox, FieldSelect } from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import { Link } from "react-router-dom";
import { accommodationBookingValidator } from "components/form/validation";
import { Allotment } from "components/accommodation";
import transliterate from "components/external/transliterate";
import ViewFailed from "parts/view-failed";
import { APR_VALUES, PAYMENT_METHODS } from "enum";
import BookingSummary from "../parts/booking-summary"
import taskSubmitBookingForm from "tasks/booking/booking-submit";
import PaymentMethodSelector from "./booking-payment-method-selector";
import { $accommodation, $personal, $payment } from "stores";

const AccommodationBookingPage = observer(() => {
    const { t } = useTranslation();

    useEffect(() => {
        $accommodation.setBookingRequest(null);
    }, []);

    if (!$accommodation.selected?.accommodationFinal?.accommodation?.id)
        return (
            <ViewFailed
                button={t("View Other Options")}
                link="/search"
            />
        );

    let accommodation = $accommodation.selected.accommodationFinal.accommodation,
        baseInfo = $accommodation.selected.accommodationFinal,
        contract = $accommodation.selected.roomContractSet,

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

    const isRestricted = contract.isAdvancePurchaseRate && ($personal.agencyAPR < APR_VALUES.CardPurchasesOnly);

    const ContinueButton = ({ formik }) => (
        <button type="submit" className={"button main" + __class(!formik.isValid, "disabled")}>
            { formik.isValid || !formik.values.accepted ?
                 (
                     PAYMENT_METHODS.ACCOUNT == $payment.paymentMethod ?
                        t("Pay") + price(contract.rate.finalPrice) :
                        t("Confirm Booking")
                 ) :
                t("You have not filled guests information")
            }
        </button>
    );

    return (
<div className="booking block">
    <div className="hide">{JSON.stringify($payment.paymentMethod)}</div>
    <section>
        <Breadcrumbs
            backText={t("Back to") + " " + t("Room Selection")}
            backLink="/search/contract"
        />
        <CachedForm
            id={ FORM_NAMES.BookingForm }
            cacheValidator={ cache => {
                if (cache?.room?.length != initialValues?.room.length)
                    return false;
                for (let i = 0; i < initialValues?.room.length; i++)
                    if (cache?.room?.[i]?.passengers?.length != initialValues?.room[i].passengers.length)
                        return false;
                return true;
            }}
            initialValues={initialValues}
            validationSchema={accommodationBookingValidator}
            onSubmit={taskSubmitBookingForm}
            render={formik => (
                <div className="billet-wrapper">
                    <div className="billet">
                        <BookingSummary
                            details={accommodation}
                            contract={contract}
                            checkInDate={baseInfo.checkInDate}
                            checkOutDate={baseInfo.checkOutDate}
                            numberOfNights={$accommodation.search.numberOfNights}
                            numberOfGuests={
                                $accommodation.search.request.adultsTotal + $accommodation.search.request.childrenTotal
                            }
                        />
                        <PaymentMethodSelector
                            contractPaymentMethods={contract.availablePaymentMethods}
                        />
                        { !!contract.priceChangedAlert &&
                            <div className="accent-frame">
                                <div className="data only">
                                    <div>{t("Please note the booking price has changed")}</div>
                                    {t("To speed up a search on a large number of accommodations, we use preloaded data. Sometimes the data may become outdated while you work with the site. When this happens, you may see a change in price or in cancellation policies on this screen. The last shown price is final.")}
                                    { !isRestricted &&
                                        <ContinueButton formik={formik} />
                                    }
                                </div>
                            </div>
                        }
                        { !isRestricted ?
                            <div>
                                { !contract.priceChangedAlert &&
                                    <ContinueButton formik={formik} />
                                }
                            </div> :
                            <div className="restricted-rate">
                                <strong>
                                    {t("Restricted Rate")}
                                </strong>
                            </div>
                        }
                        { !isRestricted &&
                            <div className="checkbox-holder">
                                <FieldCheckbox
                                    formik={formik}
                                    id="accepted"
                                    label={<>
                                        {t("I have read and accepted")}
                                        <Link
                                            target="_blank"
                                            to="/terms"
                                            className="underlined link"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            {t("Terms & Conditions")}
                                        </Link>
                                    </>}
                                />
                            </div>
                        }
                    </div>
                    <div className="another">
                        { formik.isSubmitting &&
                            <Loader page />
                        }
                        <div className="form">
                            <FieldArray render={() => (
                                contract?.rooms.map((room, r) =>
                                    <div className="room-container" key={r}>
                                        <h2>
                                            <GroupRoomTypesAndCount solo contracts={[room]} />
                                        </h2>
                                        <table className="room-details"><tbody>
                                            <FieldArray render={() => formik.values.room[r].passengers.map((passengers, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <FieldSelect
                                                            formik={formik}
                                                            id={`room.${r}.passengers.${index}.title`}
                                                            placeholder={index < room.adultsNumber ?
                                                                t("Select") :
                                                                __plural(t, room.childrenAges[index - room.adultsNumber], "year")
                                                            }
                                                            label={t("Title")}
                                                            options={[
                                                                { value: "Mr", text: t("Mr.")},
                                                                { value: "Ms", text: t("Ms.")},
                                                                { value: "Miss", text: t("Miss")},
                                                                { value: "Mrs", text: t("Mrs.")}
                                                            ]}
                                                        />
                                                    </td>
                                                    <td>
                                                        <FieldText
                                                            formik={formik}
                                                            id={`room.${r}.passengers.${index}.firstName`}
                                                            placeholder={t("Enter First Name")}
                                                                   label={t("First Name")}
                                                            onChange={transliterate}
                                                        />
                                                    </td>
                                                    <td>
                                                        <FieldText
                                                            formik={formik}
                                                            id={`room.${r}.passengers.${index}.lastName`}
                                                            placeholder={t("Enter Last Name")}
                                                            label={t("Last Name")}
                                                            onChange={transliterate}
                                                        />
                                                    </td>
                                                </tr>
                                            ))} />
                                        </tbody></table>

                                        <Allotment
                                            contract={contract}
                                            room={room}
                                        />
                                    </div>
                            ))} />

                            <div className="row itinerary">
                                <FieldText
                                    formik={formik}
                                    id="itineraryNumber"
                                    label={t("Itinerary number")}
                                    placeholder={t("Please enter itinerary number")}
                                    className="size-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    </section>
</div>
    );
});

export default AccommodationBookingPage;
