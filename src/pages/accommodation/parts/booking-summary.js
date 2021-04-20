import React from "react";
import { useTranslation } from "react-i18next";
import { date, price } from "simple";
import { Dual, RoomPrices } from "components/simple";

const BookingSummary = ({
    details,
    contract,
    checkInDate,
    checkOutDate,
    numberOfNights,
    numberOfGuests,
    agentReference,
    tags
}) => {
    const { t } = useTranslation();

    const rooms = contract.rooms || details.roomDetails || [];
    const finalPrice = contract.rate?.finalPrice || contract.totalPrice;
    const photo = details.photo?.sourceUrl;

    return (
        <>
            <div className="subtitle">
                {details.location?.locality ? details.location.locality + ", " : ""}
                {details.location.address}
            </div>
            <h4 className="title">
                {details.name || details.accommodationName}
            </h4>
            { !!details?.contactInfo?.phones?.length &&
                <div className="subtitle">
                    {t("Phone")}: {details.contactInfo.phones.join(", ")}
                </div>
            }
            { contract.isDirectContract &&
                <div>
                    <strong>
                        Direct Connectivity
                    </strong>
                </div>
            }
            { !!photo &&
            <div className="photo-holder">
                <div className="photo" style={{ backgroundImage: `${photo}` }} />
            </div>
            }

            <h4>
                {t("Reservation Summary")}
            </h4>
            { !!agentReference &&
                <Dual
                    a={t("Agent Reference")}
                    b={<strong>{agentReference}</strong>}
                />
            }
            { contract.supplier &&
                <Dual
                    a="Supplier"
                    b={<i>{contract.supplier}</i>}
                />
            }
            <Dual
                a={t("Arrival Date")}
                b={date.format.a(checkInDate)}
            />
            <Dual
                a={t("Departure Date")}
                b={date.format.a(checkOutDate)}
            />
            <Dual
                a={t("Number of Rooms")}
                b={__plural(t, rooms.length, "Room")}
            />
            <Dual
                a={t("Night_plural")}
                b={__plural(t, numberOfNights || details.numberOfNights, "Night")}
            />
            <Dual
                a={t("Guest_plural")}
                b={__plural(t, numberOfGuests || details.numberOfPassengers, "Night")}
            />
            <h4>{t("Room & Total Cost")}</h4>
            { rooms?.map((room, i) => (
                <React.Fragment key={"trc"+i}>
                    { room.dailyRoomRates?.[0].finalPrice !== undefined &&
                        <RoomPrices
                            prices={room.dailyRoomRates}
                            index={rooms?.length > 1 ? i+1 : ""}

                        />
                    }
                    <Dual
                        a={t("Room") + (rooms?.length > 1 ? (" " + (i+1)) : '') + " " + t("Cost")}
                        b={price(room.rate?.finalPrice || room.price)}
                    />
                </React.Fragment>
            ))}
            <Dual
                a={t("Total Cost")}
                b={price(finalPrice)}
                className="total-price"
            />
        </>
    );
};

export default BookingSummary;
