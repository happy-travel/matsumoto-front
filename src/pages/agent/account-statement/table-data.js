import React from "react";
import { Link } from "react-router-dom";
import { date, price } from "simple";

export const Columns = t => [
    {
        header: t("Date"),
        cell: row => date.format.c(row.created)
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
        cell: row => <Link className="link" to={`/booking/${row.referenceCode}`}>
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
