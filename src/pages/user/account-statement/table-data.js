import React from "react";
import { dateFormat, price, PassengerName } from "simple";

const getClassByStatus = status => ({
    //todo: fill
}[status] || "");

const remapStatus = (status = "") => status.replace(/([A-Z])/g, " $1");

export const Columns = t => [
    {
        header: t("Date"),
        cell: row => dateFormat.c(row.created)
    },
    {
        header: t("Amount"),
        cell: row => <>{price(row.currency, row.amount)}</>
    },
    {
        header: t("Status"),
        cell: row => (
            <span class={getClassByStatus(row.status)}>
                {remapStatus(row.status) || "Unknown"}
            </span>
        )
    },
    {
        header: t("Reference code"),
        cell: "eventData.reason"
    },
    {
        header: t("Accommodation"),
        cell: row => PassengerName({passenger: row.rooms?.[0]?.passengers?.[0]}) || t("None")
    },
    {
        header: t("Leading Passenger"),
        cell: () => "Unknown"
    }
];

export const Sorters = t => [
    {
        title: t("Date"),
        sorter: v => -new Date(v.created)
    },
    {
        title: t("Creation (old first)"),
        sorter: v => new Date(v.created)
    },
    {
        title: t("Status"),
        sorter: v => v.status
    },
    {
        title: t("Amount"),
        sorter: v => v.amount
    }
];

export const Searches = v => [
    v.eventData.reason,
    v.eventType,
    v.paymentMethod
];
