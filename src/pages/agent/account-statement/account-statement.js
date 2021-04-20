import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date } from "simple";
import { Formik } from "formik";
import Table from "components/table";
import { FieldDatepicker } from "components/form";
import { Columns, Sorters, Searches } from "./table-data";
import SettingsHeader from "pages/settings/parts/settings-header";
import SettingsNav from "pages/settings/parts/settings-nav";
import { $personal } from "stores";

const initialValues = {
    start: date.addMonth(new Date(), -1),
    end: new Date()
};

@observer
class AccountStatementPage extends React.Component {
    state = {
        filterTab: null,
        payments: null
    };

    fetchBillingHistory = (values) => {
        if (!$personal.information?.counterparties?.length)
            return;

        values = {...initialValues, ...values};

        API.get({
            url: API.PAYMENTS_HISTORY,
            body: {
                $filter: `created gt ${
                    date.format.api(values.start)
                } and created lt ${
                    date.format.api(date.addDay(values.end, 1))
                }`
            },
            success: payments => this.setState({ payments })
        });
    };

    componentDidMount() {
        this.fetchBillingHistory();
    }

    render() {
        var { t } = useTranslation();

        var filter = result => {
            if (this.state.filterTab) {
                if ("Future" == this.state.filterTab ||
                    "Past" == this.state.filterTab)
                    result = result.filter(item => {
                        var isFuture = !date.passed(item.checkInDate);
                        if ("Future" == this.state.filterTab)
                            return isFuture;
                        else
                            return !isFuture;
                    });
                if ("Cancelled" == this.state.filterTab)
                    result = result.filter(item => "Cancelled" == item.status);
            }
            return result;
        };

        return (
            <>
                <div className="settings block">
                    <SettingsHeader />
                </div>
                <SettingsNav />
                <div className="management block payments-history">
                    <section className="content">
                        <Table
                            columns={Columns(t)}
                            list={this.state.payments}
                            textEmptyResult={t("You don`t have any payment history for this dates")}
                            filter={filter}
                            sorters={Sorters(t)}
                            searches={Searches}
                            CustomFilter={
                                <div className="form">
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={this.fetchBillingHistory}
                                    >
                                        {formik => (
                                            <form>
                                                <FieldDatepicker
                                                    formik={formik}
                                                    id="range"
                                                    first="start"
                                                    second="end"
                                                    label={t("Dates")}
                                                    placeholder={t("Dates")}
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
            </>
        );
    }
}

export default AccountStatementPage;
