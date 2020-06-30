import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { API } from "core";

import { Loader, dateFormat, price } from "simple";
import FieldDatepicker from "components/complex/field-datepicker";

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
    }

    submit(values) {
        if (!authStore.user?.counterparties?.length)
            return;

        values = {...initialValues, ...values};

        API.post({
            url: API.BILLING_HISTORY(authStore.activeCounterparty.id),
            body: {
                "fromDate": moment(values.start).utc(true).format(),
                "toDate": moment(values.end).add(1,"d").utc(true).format()
            },
            after: data => store.setUserPaymentsList(data)
        });
    }

    componentDidMount() {
        store.setUserPaymentsList(null);
        this.submit();
    }

    render() {
        var { t } = useTranslation(),
            list = store.userPaymentsList;

        return (
            <div class="management block payments">
                <section>
                    <h2>
                        {t("Account statement")}
                    </h2>
                </section>
                <div class="head-nav">
                    <section>
                        <div class="input-wrap">
                            <div class="form">
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={this.submit}
                                >
                                    {formik => (
                                        <form onSubmit={formik.handleSubmit}>
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
                        </div>
                    </section>
                </div>
                <section class="content">
                    <div>
                        {list === null ? <Loader /> :
                        (!list.length ?
                            <div style={{ marginTop: "30px" }}>
                                {t("You don`t have any payment history for this dates")}
                            </div> :
                            <table class="table">
                                {list.map(item => item && (
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan="3">
                                                <strong>{t("Reason")}</strong>
                                                {item.eventData.reason}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t("Amount")}</strong>
                                                {price(item.currency, item.amount)}
                                            </td>
                                            <td>
                                                <strong>{t("Created")}</strong>
                                                {dateFormat.c(item.created)}
                                            </td>
                                            <td style={{width: "70%"}}>
                                                {item.eventData.referenceCode &&
                                                    <div>
                                                        <strong>{t("Reference Code")}</strong>
                                                        {item.eventData.referenceCode}
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </table>
                        )}
                    </div>
                </section>
            </div>
        );
    }
}

export default AccountStatementPage;
