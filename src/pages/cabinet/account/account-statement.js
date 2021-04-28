import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date } from "simple";
import { Formik } from "formik";
import Table from "components/table";
import { FieldDatepicker } from "components/form";
import { Columns, Sorters, Searches } from "./table-data";
import { $personal } from "stores";

const initialValues = {
    start: date.addMonth(new Date(), -1),
    end: new Date()
};

const AccountStatementPage = () => {
    const [filterTab, setFilterTab] = useState(null);
    const [payments, setPayments] = useState(null);

    const fetchBillingHistory = (values) => {
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
            success: setPayments
        });
    };

    useEffect(() => {
        fetchBillingHistory();
    }, []);

    const filter = (result) => {
        if (filterTab) {
            if ("Future" == filterTab || "Past" == filterTab)
                result = result.filter(item => {
                    const isFuture = !date.passed(item.checkInDate);
                    if ("Future" == filterTab)
                        return isFuture;
                    else
                        return !isFuture;
                });
            if ("Cancelled" == filterTab)
                result = result.filter(item => "Cancelled" == item.status);
        }
        return result;
    };

    const { t } = useTranslation();
    return (
        <>

            <div className="management block payments-history">
                <section className="content">
                    <Table
                        columns={Columns(t)}
                        list={payments}
                        textEmptyResult={t("You don`t have any payment history for this dates")}
                        filter={filter}
                        sorters={Sorters(t)}
                        searches={Searches}
                        CustomFilter={
                            <div className="form">
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={fetchBillingHistory}
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
};

export default AccountStatementPage;
