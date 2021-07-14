import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date } from "simple";
import { Loader } from "components/simple";

const BookingHistoryView = ({ booking }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState(null);

    const loadBookingHistory = () => {
        API.get({
            url: API.BOOKING_HISTORY(booking.bookingId),
            success: (data) => data && setHistory(data.reverse()),
            after: () => setLoading(false)
        });
    };

    useEffect(() => {
        loadBookingHistory();
    }, []);

    if (!booking?.bookingId)
        return null;

    if (loading)
        return <Loader />;

    if (history?.length < 2)
        return null;

    return (
        <div className="history-status">
            <h3>History of Booking Status Changes</h3>
            <ol>
                { history.map((item) => (
                    <li>
                        <b>{date.format.a(item.createdAt)}</b>
                        {" "}{t("at")}{" "}
                        {date.format.time(item.createdAt + "Z")}
                        {" "}{t("changed to")}{" "}
                        <b>{ item.status }</b>
                        {" "}
                        { item.source !== "System" &&
                            t("by")+ " " + item.source
                        }
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default BookingHistoryView;
