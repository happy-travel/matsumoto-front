import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat, price } from "core";

import { Dual, Loader } from "components/simple";
import { Redirect } from "react-router-dom";

import store from "stores/accommodation-store";

const getClassByStatus = status => ({
    "Confirmed": "green",
    "Cancelled": "gray"
}[status] || "");

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
            url: API.BOOKING_LIST,
            after: data => store.setUserBookingList(data)
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
                        {store.userBookingList === null ? <Loader /> :
                        (!store.userBookingList.length ?
                            <div>{t("You don`t have any reservations")}</div> :
                            <table>
                                {store.userBookingList.map(item => item && (
                                    <tr
                                        onClick={() => this.setState({ redirectToBookingConfirmationId: item.id })}
                                        class={getClassByStatus(item.status) == "gray" ? "gray" : ""}
                                    >
                                        <td>
                                            <strong>{t("Accommodations")}</strong>
                                            {item.accommodationName}
                                        </td>
                                        <td>
                                            <strong>{t("Location")}</strong>
                                            {item.countryName}, {item.localityName}
                                        </td>
                                        <td>
                                            <strong>{t("Board Basis")}</strong>
                                            {item.boardBasisCode}:{" "}
                                            {item.boardBasisCode == "RO" ? t("Room Only") : (item.mealPlan || "")}
                                        </td>
                                        <td>
                                            <strong>{t("Check In")}</strong>
                                            {dateFormat.c(item.checkInDate)}
                                        </td>
                                        <td>
                                            <strong>{t("Check Out")}</strong>
                                            {dateFormat.c(item.checkOutDate)}
                                        </td>
                                        <td>
                                            <strong>{t("Cost")}</strong>
                                            {price(item.price)}
                                        </td>
                                        <td>
                                            <strong>{t("Cancellation Deadline")}</strong>
                                            {(item.deadlineDetails.date) ? dateFormat.c(item.deadlineDetails.date) : t("None")}
                                        </td>
                                        <td>
                                            <strong>{t("Status")}</strong>
                                            <span class={getClassByStatus(item.status)}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        )}
                    </div>
                </section>
            </div>
        );
    }
}

export default UserBookingManagementPage;
