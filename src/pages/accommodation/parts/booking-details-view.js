import React from "react";
import { useTranslation } from "react-i18next";
import { PassengerName, GroupRoomTypesAndCount } from "simple";
import { Allotment } from "components/accommodation";

const BookingDetailsView = ({ booking }) => {
    const { t } = useTranslation();
    const details = booking.bookingDetails;

    return (
        details.roomDetails.map((room, index) => (
            <div key={index}>
                <h2>
                    <GroupRoomTypesAndCount solo contracts={[room]} />
                </h2>

                <ul className="allotment">
                    <li className="gray">
                        <div className="primary">
                            {t("Guest_plural")}
                        </div>
                        <div className="additional guests">
                            <div>
                                <strong>1. <PassengerName passenger={room.passengers[0]} /></strong>
                            </div>
                            { room.passengers.slice(1).map((item, index) => (
                                <div key={index}>
                                    {index+2}. <PassengerName passenger={item} />
                                </div>
                            ))}
                        </div>
                    </li>
                    { !!room.supplierRoomReferenceCode &&
                    <li>
                        <div className="primary">
                            {t("Supplier Reference Code")}
                        </div>
                        <div className="additional">
                            {room.supplierRoomReferenceCode}
                        </div>
                    </li>
                    }
                </ul>
                <Allotment
                    room={room}
                    contract={details}
                />
            </div>
        ))
    );
};

export default BookingDetailsView;
