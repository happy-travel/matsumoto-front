import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat, price } from "core";

import { Loader } from "components/simple";
import { Formik } from "formik";

import AuthStore from "stores/auth-store";
import store from "stores/accommodation-store";
import { FieldText } from "components/form";

import DateDropdown from "components/form/dropdown/date";
import moment from "moment";

@observer
class AccountStatementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: moment().startOf("day").add(-1, "M"),
            end: moment().startOf("day")
        };
        this.getData = this.getData.bind(this);
    }

    getData() {
        if (!AuthStore.user?.counterparties?.length)
            return;
        API.post({
            url: API.BILLING_HISTORY(AuthStore.activeCounterparty.id),
            body: {
                "fromDate": moment(this.state.start).utc(true).format(),
                "toDate": moment(this.state.end).add(1,"d").utc(true).format()
            },
            after: data => store.setUserPaymentsList(data)
        });
    }

    componentDidMount() {
        store.setUserPaymentsList(null);
        this.getData();
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
                                    render={formik => (
                                        <form onSubmit={formik.handleSubmit}>
                                            <FieldText formik={formik}
                                                id="range"
                                                placeholder={t("Choose date")}
                                                Icon={<span class="icon icon-calendar"/>}
                                                addClass="size-medium"
                                                Dropdown={DateDropdown}
                                                value={
                                                    dateFormat.b(this.state.start)
                                                    + " – " +
                                                    dateFormat.b(this.state.end)
                                                }
                                                setValue={range => {
                                                    this.setState({
                                                        start: range.start,
                                                        end: range.end
                                                    });
                                                    this.getData();
                                                }}
                                                options={moment.range(
                                                    moment(this.state.start),
                                                    moment(this.state.end)
                                                )}
                                            />
                                        </form>
                                    )}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <section class="content">
                    <div>
                        {list === null ? <Loader /> :
                        (!list.length ?
                            <div style={{marginTop: "30px"}}>{t("You don`t have any payment history for this dates")}</div> :
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
                                            <td>
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
