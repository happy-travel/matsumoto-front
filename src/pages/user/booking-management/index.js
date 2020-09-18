import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { API } from "core";
import Table from "components/table";
import { Columns, Sorters, Searches } from "./table-data";
import store from "stores/accommodation-store";

@observer
class BookingManagementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingConfirmationId: null,
            filter_tab: null
        };
    }

    componentDidMount() {
        API.get({
            url: API.BOOKING_LIST,
            after: data => store.setUserBookingList(data)
        });
    }

    render() {
        var { t } = useTranslation();

        if (this.state.redirectToBookingConfirmationId !== null)
            return <Redirect push to={"/accommodation/confirmation/" + this.state.redirectToBookingConfirmationId} />;

        var Tab = ({ text, value }) => (
            <li>
                <div
                    class={"item" + __class(value == this.state.filter_tab, "selected")}
                    onClick={() => this.setState({ filter_tab: value })}
                >
                    {text}
                </div>
            </li>
        );

        var filter = result => {
            if (this.state.filter_tab) {
                if ("Future" == this.state.filter_tab ||
                    "Past" == this.state.filter_tab)
                    result = result.filter(item => {
                        var isFuture = moment(item.checkInDate).isAfter(new Date());
                        if ("Future" == this.state.filter_tab)
                            return isFuture;
                        else
                            return !isFuture;
                    });
                if ("Cancelled" == this.state.filter_tab)
                    result = result.filter(item => "Cancelled" == item.status);
            }
            return result;
        };

        return (
            <div class="management block">
                <section>
                    <h2>
                        {t("Your Bookings")}
                    </h2>
                </section>
                <div class="head-nav">
                    <section>
                        <nav>
                            <Tab text={t("All")} value={null} />
                            <Tab text={t("Future")} value="Future" />
                            <Tab text={t("Complete")} value="Complete" />
                            <Tab text={t("Cancelled")} value="Cancelled" />
                        </nav>
                    </section>
                </div>
                <section class="content">
                    <Table
                        columns={Columns(t)}
                        list={store.userBookingList}
                        textEmptyResult={t("No reservations found")}
                        textEmptyList={t("You don`t have any reservations")}
                        onRowClick={item => this.setState({ redirectToBookingConfirmationId: item.id })}
                        rowClassName={item => __class(getClassByStatus(item.status) == "gray", "gray")}
                        filter={filter}
                        sorters={Sorters(t)}
                        searches={Searches}
                    />
                </section>
            </div>
        );
    }
}

export default BookingManagementPage;
