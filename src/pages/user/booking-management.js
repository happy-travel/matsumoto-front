import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat } from "core";

import { Dual } from "components/simple";
import { Redirect } from "react-router-dom";

import store from "stores/accommodation-store";

@observer
class UserBookingManagementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingConfirmationId: null
        };
    }

    componentDidMount() {
        API.get({
            url: API.ACCOMMODATION_BOOKING,
            after: (data) => {
                store.setUserBookingList(data);
            }
        });
    }

    render() {
        const { t } = useTranslation();

        if (this.state.redirectToBookingConfirmationId !== null)
            return <Redirect push to={"/accommodation/confirmation/" + this.state.redirectToBookingConfirmationId} />;

        return (
            <div class="management block">
                <section>
                    <h2>
                        {t("Your Booking")}
                    </h2>
                    <div>
                        {!store.userBookingList?.length ?
                            <div>You don't have any reservations</div> :
                            <table>
                                {store.userBookingList.map(item => {
                                    var bookingDetails = item.bookingDetails,
                                        serviceDetails = item.serviceDetails;

                                    if (!bookingDetails || !serviceDetails)
                                        return null;

                                    return (<tr onClick={() => this.setState({ redirectToBookingConfirmationId: item.bookingId })}>
                                        <td>
                                            <strong>{t("Accommodation")}</strong>
                                            {bookingDetails.roomDetails[0].roomDetails.type}
                                        </td>
                                        <td>
                                            <strong>{t("Location")}</strong>
                                            {bookingDetails.cityCode}
                                        </td>
                                        <td>
                                            <strong>{t("Board Basis")}</strong>
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
                                            <strong>{t("Cancellation Deadline")}</strong>
                                            {serviceDetails.deadlineDetails?.date ? dateFormat.c(serviceDetails.deadlineDetails.date) : "None"}
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

export default UserBookingManagementPage;
