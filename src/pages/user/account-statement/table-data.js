import React from "react";
import { Link } from "react-router-dom";
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
        header: t("Event Type"),
        cell: "eventType"
    },
    {
        header: t("Reference code"),
        cell: row => <Link class="link" to={`/accommodation/confirmation/${row.bookingId}`}>
                         {row.referenceCode}
                     </Link>
    },
    {
        header: t("Accommodation"),
        cell: "accommodationName"
    },
    {
        header: t("Leading Passenger"),
        cell: "leadingPassenger"
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
        title: t("Event Type"),
        sorter: v => v.eventType
    },
    {
        title: t("Amount"),
        sorter: v => v.amount
    }
];

export const Searches = v => [
    v.referenceCode,
    v.accommodationName,
    v.leadingPassenger,
    v.paymentMethod
];
