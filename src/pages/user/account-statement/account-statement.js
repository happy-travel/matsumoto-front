import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { API } from "core";
import Table from "components/table";
import FieldDatepicker from "components/complex/field-datepicker";
import { Columns, Sorters, Searches } from "./table-data";

import authStore from "stores/auth-store";
import store from "stores/accommodation-store";

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
            filter_tab: null
        };
    }

    submit(values) {
        if (!authStore.user?.counterparties?.length)
            return;

        values = {...initialValues, ...values};

        API.post({
            url: API.BILLING_HISTORY(authStore.activeCounterparty.agencyId),
            body: {
                "fromDate": moment(values.start).utc(true).format(),
                "toDate": moment(values.end).add(1,"d").utc(true).format()
            },
            after: data => store.setUserPaymentsList(data || [])
        });
    }

    componentDidMount() {
        store.setUserPaymentsList(null); // todo : make mini-loader updater and remove this
        this.submit();
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
            <div class="management block payments-history">
                <section>
                    <h2>
                        {t("Account statement")}
                    </h2>
                </section>
                <section class="content">
                    <Table
                        columns={Columns(t)}
                        list={store.userPaymentsList}
                        textEmptyResult={t("You don`t have any payment history for this dates")}
                        rowClassName={item => __class(getClassByStatus(item.status) == "gray", "gray")}
                        filter={filter}
                        sorters={Sorters(t)}
                        searches={Searches}
                        CustomFilter={null /* todo: <FieldDatepicker
                            id="range"
                            first="start"
                            second="end"
                            placeholder={t("Choose date")}
                            onChange={this.submit}
                        /> */}
                    />
                </section>
            </div>
        );
    }
}

export default AccountStatementPage;
