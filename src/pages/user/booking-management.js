import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat, price } from "core";

import { Dual, Loader } from "components/simple";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";

import store from "stores/accommodation-store";
import moment from "moment";
import { FieldText } from "components/form";

const getClassByStatus = status => ({
    "Confirmed": "green",
    "Cancelled": "gray"
}[status] || "");

const Filter = ({ text, value, that }) => (
    <li><div
        class={"item" + (value == that.state.filter_time ? " selected" : "")}
        onClick={() => that.setState({ filter_time: value })}
    >{text}</div></li>
);

const Sorter = ({ text, value, that }) => (
    <div
        class={"item" + (value == that.state.sort_by ? " selected"+that.state.sort_order : "")}
        onClick={() => {
            if (value == that.state.sort_by)
                that.setState({ sort_order: -that.state.sort_order });
            else
                that.setState({
                    sort_by: value,
                    sort_order: 1
                });
        }}
    >{text}</div>
);

@observer
class UserBookingManagementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingConfirmationId: null,
            filter_time: null,
            sort_by: null,
            sort_order: 1,
            search_query: ""
        };
        this.getList = this.getList.bind(this);
        this.searchChange = this.searchChange.bind(this);
    }

    getList() {
        var result = store.userBookingList,
            sort = this.state.sort_by,
            order = this.state.sort_order,
            search = this.state.search_query;

        if (!result || !result.length)
            return null;

        result = result.filter(() => true);

        if (this.state.filter_time)
            result = result.filter(item => {
                var isFuture = moment(item.checkInDate).isAfter(new Date());
                if ("Future" == this.state.filter_time)
                    return isFuture;
                else
                    return !isFuture;
            });

        if (sort)
            result.sort((a,b) => {
                var x, y;

                if ("Accommodations" == sort) {
                    x = a.accommodationName;
                    y = b.accommodationName;
                }

                if ("Location" == sort) {
                    x = a.countryName + a.localityName;
                    y = b.countryName + b.localityName;
                }

                if ("Board Basis" == sort) {
                    x = a.boardBasis;
                    y = b.boardBasis;
                }

                if ("Check In" == sort) {
                    x = 0; y = 0;
                    if (moment(a.checkInDate).isAfter(b.checkInDate)) { x = 1; y = 0; }
                    if (moment(b.checkInDate).isAfter(a.checkInDate)) { x = 0; y = 1; }
                }

                if ("Cost" == sort) {
                    x = a.price.netTotal;
                    y = b.price.netTotal;
                }

                if ("Status" == sort) {
                    x = a.status;
                    y = b.status;
                }

                if (x?.toLowerCase) x = x.toLowerCase();
                if (y?.toLowerCase) y = y.toLowerCase();
                if (x < y) return order;
                if (x > y) return -order;
                return 0;
            });

        if (search)
            result = result.filter(i => {
                var found = values => {
                    for (var i = 0; i < values.length; i++)
                        if ((values[i] || "").toLowerCase().indexOf(search.toLowerCase()) >= 0)
                            return true;
                    return false;
                };
                return found([
                    i.referenceCode,
                    i.accommodationName,
                    i.countryName,
                    i.localityName,
                    i.boardBasis,
                    i.status,
                    i.mealPlan,
                    i.contractType
                ])
            });

        return result;
    }

    searchChange(e) {
        this.setState({
            search_query: e.target.value
        });
    }

    componentDidMount() {
        API.get({
            url: API.BOOKING_LIST,
            after: data => store.setUserBookingList(data)
        });
    }

    render() {
        var { t } = useTranslation(),
            list = this.getList();

        if (this.state.redirectToBookingConfirmationId !== null)
            return <Redirect push to={"/accommodation/confirmation/" + this.state.redirectToBookingConfirmationId} />;

        return (
            <div class="management block">
                <section>
                    <h2>
                        {t("Your Booking")}
                    </h2>
                </section>
                <div class="head-nav">
                    <section>
                        <nav>
                            <Filter text={t("All")} value={null} that={this} />
                            <Filter text={t("Future")} value="Future" that={this} />
                            <Filter text={t("Complete")} value="Complete" that={this} />
                        </nav>
                        <div class="input-wrap">
                            <div class="form">
                                <Formik
                                    initialValues={{ search: "" }}
                                    onSubmit={() => {}}
                                >
                                {formik => (
                                    <form onSubmit={formik.handleSubmit}>
                                        <FieldText formik={formik}
                                                   id="search"
                                                   placeholder={t("Search...")}
                                                   onChange={this.searchChange}
                                        />
                                    </form>
                                )}
                                </Formik>
                            </div>
                        </div>
                    </section>
                </div>
                <section class="content">
                    <div class="sorters">
                        <div class="title">Sort by</div>
                        <Sorter text={t("Accommodations")} value={"Accommodations"} that={this} />
                        <Sorter text={t("Location")} value={"Location"} that={this} />
                        <Sorter text={t("Board Basis")} value={"Board Basis"} that={this} />
                        <Sorter text={t("Check In")} value={"Check In"} that={this} />
                        <Sorter text={t("Cost")} value={"Cost"} that={this} />
                        <Sorter text={t("Status")} value={"Status"} that={this} />
                    </div>
                    <div>
                        {list === null ? <Loader /> :
                        (!list.length ?
                                (store.userBookingList
                                    ? <div>{t("No reservations found")}</div>
                                    : <div>{t("You don`t have any reservations")}</div>) :
                            <table class="table">
                                {list.map(item => item && (
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
                                            {item.deadline ? dateFormat.c(item.deadline) : t("None")}
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
