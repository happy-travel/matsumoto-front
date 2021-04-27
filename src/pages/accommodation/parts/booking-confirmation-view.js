import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { remapStatus } from "simple";
import { Dual, Loader } from "components/simple";
import ViewFailed from "parts/view-failed";
import BookingActionPart from "./booking-actions";
import BookingDetailsView from "./booking-details-view";
import BookingSummary from "../parts/booking-summary"

const BookingConfirmationView = ({ referenceCode, PaymentInformation }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);

    const loadBooking = async () => {
        const result = await API.get({
            url: referenceCode ?
                API.BOOKING_GET_BY_CODE(referenceCode) :
                API.BOOKING_GET_BY_ID(bookingId)
        });
        setBooking(result);
        setLoading(false);
    };

    const updateBookingStatus = async () => {
        setLoading(true);
        try {
            await API.post({
                url: API.BOOKING_STATUS(booking.bookingId)
            });
            loadBooking();
        } catch {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooking();
    }, []);


    if (!booking && loading)
        return <Loader />;

    if (!booking)
        return (
            <ViewFailed
                reason={t("Unable to load a booking confirmation")}
                button={t("Back to") + " " + t("Booking Management")}
                link="/bookings"
            />
        );

    const details = booking.bookingDetails;

    return (
        <>
            { loading && <Loader page /> }

            <div className="billet-wrapper">
                <div className="billet">
                    <BookingSummary
                        details={booking.bookingDetails}
                        contract={booking}
                        checkInDate={details.checkInDate}
                        checkOutDate={details.checkOutDate}
                        agentReference={details.agentReference}
                    />
                    { booking.paymentStatus &&
                        <Dual
                            a={t("Payment Status")}
                            b={<strong>{booking.paymentStatus.replace(/([A-Z])/g, " $1")}</strong>}
                        />
                    }
                    <BookingActionPart booking={booking} />
                </div>
                <div className="another">
                    { PaymentInformation ? PaymentInformation : null }
                    <div className="accent-frame">
                        <div className={"before" + __class(details.status)}>
                            { details.status === "Confirmed" ?
                                <span className="icon icon-success" /> :
                                <span className="icon icon-information" />
                            }
                        </div>
                        <div className="data">
                            <div className="first">
                                {t("Booking Reference number")}<br />
                                <span className={"status " + details.status}>{details.referenceCode}</span>
                            </div>
                            <div className="second">
                                {t("Status")}<br/>
                                <strong className={"status " + details.status}>{remapStatus(details.status)}</strong>
                            </div>
                        </div>
                        <div className="after">
                            <div className="status-updater">
                                { loading ?
                                    <span>...</span> :
                                    <button className="small button" onClick={updateBookingStatus}>
                                        <span className="icon icon-refresh" />
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    <BookingDetailsView booking={booking} />
                </div>
            </div>
        </>
    );
};

export default BookingConfirmationView;
