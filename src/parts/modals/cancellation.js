import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date, price } from "simple";
import { Loader } from "components/simple";
import { $view, $accommodation } from "stores";

const CancellationConfirmationModal = observer(({ closeModal }) => {
    const [penalty, setPenalty] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { bookingId } = $view.modalData;
        API.get({
            url: API.BOOKING_PENALTY(bookingId),
            success: setPenalty
        });
    }, []);

    const bookingCancel = () => {
        const { bookingId } = $view.modalData;
        setLoading(true);
        API.post({
            url: API.BOOKING_CANCEL(bookingId),
            success: () => {
                window.location.reload();
            },
            error: () => setLoading(false)
        });
    };

    const { t } = useTranslation();
    const { bookingDetails } = $view.modalData;

    return (
    <div className="confirm modal">
        { loading &&
            <Loader page />
        }

        { closeModal &&
            <div className="close-button" onClick={closeModal}>
                <span className="icon icon-close" />
            </div>
        }

        { date.isPast(bookingDetails.checkInDate) ?
            <>
                <h2>{t("Cancellation Deadline")}</h2>
                <p style={{ maxWidth: 290 }}>
                    {t("Cancellation is not possible furthermore, Check-in Date passed")}.
                </p>
            </> :
            <>
                <h2>{t("Are you sure you want to cancel your booking?")}</h2>
                <p>
                    {t("You are about to cancel booking")} {bookingDetails.referenceCode}
                </p>
                { date.isFuture(bookingDetails.deadlineDate) ?
                    <p>
                        {t("FREE Cancellation - Without Prepayment")}
                    </p> :
                    <p>
                        {t("Cancellation Deadline")} {date.format.a(bookingDetails.deadlineDate)} {t("has passed. A cancellation fee will be charged according to accommodation's cancellation policy.")}
                    </p>
                }
                <p className="danger">
                    { penalty?.amount ?
                        <>
                            {t("Cancellation cost")}: {price(penalty)}
                        </> :
                        <br />
                    }
                </p>

                <div className="bottom">
                    <button
                        className={"button" + __class(date.isFuture(bookingDetails.deadlineDate), "green")}
                        onClick={bookingCancel}
                    >
                        {t("Cancel booking")}
                    </button>
                </div>
            </>
        }
    </div>
    );
});

export default CancellationConfirmationModal;
