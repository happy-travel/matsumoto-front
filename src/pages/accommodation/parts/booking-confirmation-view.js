import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader, remapStatus } from "simple";
import ViewFailed from "parts/view-failed";
import BookingActionPart from "./booking-actions";
import BookingDetailsView from "./booking-details-view";

@observer
class BookingConfirmationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            booking: null
        };
    }

    updateBookingStatus = async () => {
        const { booking } = this.state;
        this.setState({ loading: true });
        try {
            await API.post({
                url: API.BOOKING_STATUS(booking.bookingId)
            });
            this.loadBooking();
        } catch {
            this.setState({ loading: false });
        }
    };

    loadBooking = async () => {
        const { bookingId, referenceCode } = this.props;

        const booking = await API.get({
            url: referenceCode ?
                API.BOOKING_GET_BY_CODE(referenceCode) :
                API.BOOKING_GET_BY_ID(bookingId)
        });
        this.setState({
            booking,
            loading: false
        });
    };

    componentDidMount() {
        this.loadBooking();
    }

    render() {
        const { t } = useTranslation(),
            { loading, booking } = this.state;

        if (!booking && !loading)
            return <Loader />;

        if (!booking)
            return (
                <ViewFailed
                    reason={t("Unable to load a booking confirmation")}
                    button={t("Back to booking management")}
                    link="/bookings"
                />
            );

        const details = booking.bookingDetails;

        return (
<>
    { loading && <Loader page /> }

    <div className={"accent-frame" + __class("Cancelled" == details.status, "cancelled")}>
        <div className="before">
            <span className="icon icon-white-check" />
        </div>
        <div className="dual">
            <div className="first">
                {t("Booking Reference number")}: <strong className="green">{details.referenceCode}</strong>
            </div>
            {loading ?
                <div className="second">
                    Updating...
                </div> :
                <div className="second">
                    {t("Status")}: <strong className={details.status}>{remapStatus(details.status)}</strong>
                    <div className="status-updater">
                        <button className="small button" onClick={() => this.updateBookingStatus()}>
                            ⟳
                        </button>
                    </div>
                </div>
            }
        </div>
    </div>

    <BookingDetailsView booking={booking} />

    <BookingActionPart booking={booking} />
</>
        );
    }
}

export default BookingConfirmationView;
