import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat } from "core";

import { Dual } from "components/simple";
import { Link } from "react-router-dom";

import store from "stores/accommodation-store";


@observer
class BookingManagementPage extends React.Component {

    componentDidMount() {
        API.get({
            url: API.ACCOMMODATION_BOOKING,
            after: (data) => {
                store.setUserBookingList(data || {});
                console.log(data);
            }
        });
    }

    render() {
        const { t } = useTranslation();


        return (
                <div class="management block">
                    <section>
                        <h2>
                            {t("Your Booking")}
                        </h2>
                        <div style={{ minHeight: "300px"}}>
                            {!store.userBookingList?.length ? <div>You don't have any reservations</div> :
                                <table>
                                    {store.userBookingList.map(item => {
                                        var bookingDetails, serviceDetails;
                                        try {
                                            bookingDetails = JSON.parse(item.bookingDetails);
                                            serviceDetails = JSON.parse(item.serviceDetails);
                                        } catch (e) {}

                                        if (!bookingDetails || !serviceDetails)
                                            return null;

                                        return (<tr>
                                            <td>
                                                <strong>{t("Accommodation")}</strong>
                                                {bookingDetails.roomDetails[0].roomDetails.type}
                                            </td>
                                            <td>
                                                <strong>{t("Location")}</strong>
                                                {bookingDetails.cityCode}
                                            </td>
                                            <td>
                                                <strong>{t("Board basis")}</strong>
                                                {serviceDetails.agreement?.mealPlan}
                                            </td>
                                            <td>
                                                <strong>{t("Check In")}</strong>
                                                {dateFormat.c(bookingDetails.checkInDate)}
                                            </td>
                                            <td>
                                                <strong>{t("Check Out")}</strong>
                                                {dateFormat.c(bookingDetails.checkOutDate)}
                                            </td>
                                            <td>
                                                <strong>{t("Cost")}</strong>
                                                {serviceDetails.agreement?.currencyCode}
                                                {' '}
                                                {bookingDetails.roomDetails[0].price.price}
                                            </td>
                                            <td>
                                                <strong>{t("Cancel")}</strong>
                                            </td>
                                            <td>
                                                <strong>{t("Status")}</strong>
                                                {bookingDetails.status}
                                            </td>
                                            <br/>
                                        </tr>);
                                    })}
                                </table>
                            }

                        </div>
                    </section>
                </div>
        );
    }
}

export default BookingManagementPage;
