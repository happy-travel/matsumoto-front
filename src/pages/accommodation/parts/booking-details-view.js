import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Dual, Loader, MealPlan, PassengerName, GroupRoomTypesAndCount, dateFormat, price, remapStatus } from "simple";
import FullDeadline from "components/full-deadline";
import ViewFailed from "parts/view-failed";
import BookingActionPart from "./booking-actions";

@observer
class BookingDetailsView extends React.Component {
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

        const details = booking.bookingDetails,
            contacts = details.contactInfo,
            location = details.location;

        return (
<>
    { loading && <Loader page /> }

    <div class={"accent-frame" + __class("Cancelled" == details.status, "cancelled")}>
        <div class="before">
            <span class="icon icon-white-check" />
        </div>
        <div class="dual">
            <div class="first">
                {t("Booking Reference number")}: <strong class="green">{details.referenceCode}</strong>
            </div>
            {loading ?
                <div class="second">
                    Updating...
                </div> :
                <div class="second">
                    {t("Status")}: <strong class={details.status}>{remapStatus(details.status)}</strong>
                    <div class="status-updater">
                        <button class="small button transparent-with-border" onClick={() => this.updateBookingStatus()}>
                            ⟳
                        </button>
                    </div>
                </div>
            }
        </div>
    </div>

    <h2 class="underline">{t("Accommodation")}</h2>
    <div class="part">
        <div class="icon-holder">
            <span class="icon icon-confirmation-price" />
        </div>
        <div>
            <Dual
                a={t("Booked Service")}
                b={ details.accommodationName }
            />
            <Dual
                a={t("Address")}
                b={ details.location.address }
            />
            { !!contacts.phone && <Dual
                a={t("Contact")}
                b={ contacts.phone }
            /> }
            <Dual
                  a={t("Service Location")}
                  b={ location.country + ", " + location.locality }
            />
            { !!details.agentReference && <Dual
                a={t("Agent Reference")}
                b={details.agentReference}
            /> }
            { !!booking.supplier &&
            <Dual addClass="grow"
                  a={"Supplier"}
                  b={booking.supplier}
            />
            }
        </div>
    </div>

    <h2 class="underline">{t("Booking Details")}</h2>
    <div class="part">
        <div class="icon-holder">
            <span class="icon icon-confirmation-dates"/>
        </div>
        <div class="line">
            <Dual
                  a={t("Your Booking")}
                  b={
                      __plural(t, details.numberOfNights, "Night") + ", " +
                      __plural(t, details.roomDetails.length, "Room")
                  }
            />
            <Dual
                a={"Check In Date"}
                b={dateFormat.a(details.checkInDate)}
            />
            <Dual
                a={"Check Out Date"}
                b={dateFormat.a(details.checkOutDate)}
            />
        </div>
    </div>
    <div class="part">
        <div class="icon-holder">
            <span class="icon icon-confirmation-hotel"/>
        </div>
        <div class="line">
            <Dual
                a={t("Total Cost")}
                b={<b class="green">{price(booking.totalPrice)}</b>}
            />
            { booking.paymentStatus && <Dual addClass="grow"
                a={t("Payment Status")}
                b={booking.paymentStatus.replace(/([A-Z])/g, " $1")}
            /> }
        </div>
    </div>

    <h2 class="underline">{t("Room Details")}</h2>
    { details.roomDetails.map((room, index) => (
        <div class="room-part">
            <div class="part">
                <div class="icon-holder">
                    <div class="icon icon-confirmation-circle">
                        { details.roomDetails.length > 1 ?
                            index+1 :
                            <span class="icon icon-confirmation-passenger"/>
                        }
                    </div>
                </div>
                <div class="line">
                    <Dual
                        a={t("Room type")}
                        b={<GroupRoomTypesAndCount solo t={t} contracts={[room]} />}
                    />
                    <Dual
                        a={t("Board basis")}
                        b={<MealPlan t={t} room={room} />}
                    />
                    <Dual
                        a={t("Room Cost")}
                        b={<b class="green">{price(room.price)}</b>}
                    />
                </div>
            </div>
            <div class="part no-icon">
                <Dual
                    a={t("Accommodates")}
                    b={[...Array(room.passengers.length).fill(<span class="icon icon-man"/>)]}
                />
                <Dual addClass={__class(room.passengers.length < 2, "grow")}
                    a={t("Leading Passenger")}
                    b={<PassengerName passenger={room.passengers[0]} />}
                />
                { (room.passengers.length > 1) &&
                    <Dual
                        a={t("Other Passengers")}
                        b={room.passengers.map( (item, index) => ( !!index &&
                            <div><PassengerName passenger={ item } /></div>
                        ))}
                    />}
            </div>
            { room.supplierRoomReferenceCode && <div class="part no-icon">
                <Dual
                    a={t("Supplier Reference Code")}
                    b={room.supplierRoomReferenceCode}
                />
            </div> }
            { room?.deadlineDetails.date &&
                <FullDeadline
                    t={t}
                    deadline={room.deadlineDetails}
                    remarks={room?.remarks}
                />
            }
        </div>
    ))}
    { !details.roomDetails[0]?.deadlineDetails.date && !!details.deadlineDate &&
        <FullDeadline
            t={t}
            deadline={{ date: details.deadlineDate }}
        />
    }{ /* temporary workaround: deadline dates conflict */ }

    <BookingActionPart booking={booking} />
</>
        );
    }
}

export default BookingDetailsView;
