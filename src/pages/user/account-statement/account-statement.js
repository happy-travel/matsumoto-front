import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { API } from "core";
import { Formik } from "formik";
import Table from "components/table";
import FieldDatepicker from "components/complex/field-datepicker";
import { Columns, Sorters, Searches } from "./table-data";

import authStore from "stores/auth-store";
import store from "stores/accommodation-store";
import SettingsHeader from "../../settings/parts/settings-header";

const initialValues = {
    start: moment().startOf("day").add(-1, "M"),
    end: moment().startOf("day")
};

@observer
class AccountStatementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingConfirmationId: null,
            filter_tab: null,
            payments: null
        };
    }

    fetchBillingHistory = (values) => {
        if (!authStore.user?.counterparties?.length)
            return;

        values = {...initialValues, ...values};

        API.get({
            url: API.PAYMENTS_HISTORY,
            body: {
                $filter: `created gt ${
                    moment(values.start).utc(true).format()
                } and created lt ${
                    moment(values.end).add(1,"d").utc(true).format()
                }`
            },
            success: payments => this.setState({ payments })
        });
    }

    componentDidMount() {
        this.fetchBillingHistory();
    }

    render() {
        var { t } = useTranslation();

        if (this.state.redirectToBookingConfirmationId !== null)
            return <Redirect push to={"/accommodation/confirmation/" + this.state.redirectToBookingConfirmationId} />;

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
            <React.Fragment>
                <div class="settings block">
                    <SettingsHeader />
                </div>
                <div class="management block payments-history">
                    <section class="content">
                        <Table
                            columns={Columns(t)}
                            list={this.state.payments}
                            textEmptyResult={t("You don`t have any payment history for this dates")}
                            filter={filter}
                            sorters={Sorters(t)}
                            searches={Searches}
                            CustomFilter={
                                <div class="form">
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={this.fetchBillingHistory}
                                    >
                                        {formik => (
                                            <form>
                                                <FieldDatepicker formik={formik}
                                                                 id="range"
                                                                 first="start"
                                                                 second="end"
                                                                 placeholder={t("Choose date")}
                                                                 onChange={formik.handleSubmit}
                                                />
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            }
                        />
                    </section>
                </div>
            </React.Fragment>
        );
    }
}

export default AccountStatementPage;
