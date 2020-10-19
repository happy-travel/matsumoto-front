import React from "react";
import { dateFormat, price, PassengerName } from "simple";

const getClassByStatus = status => ({
    "Confirmed": "green",
    "Captured": "green",
    "Cancelled": "gray"
}[status] || "");

const remapStatus = (status = "") => ({
    "WaitingForResponse" : "Awaiting Final Confirmation"
}[status] || status.replace(/([A-Z])/g, " $1"));

export const Columns = (t, setAgentIdFilter) => [
    {
        header: t("Agent"),
        cell: row => (
            <span class="link" onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAgentIdFilter(row.agent.id);
            }}>
                {row.agent?.firstName} {row.agent?.lastName}
            </span>
        ),
    },
    {
        header: t("Reference code"),
        cell: "referenceCode",
    },
    {
        header: t("Accommodation"),
        cell: "accommodationName",
    },
    {
        header: t("Location"),
        cell: row => <>{row.countryName}, {row.localityName}</>
    },
    {
        header: t("Leading Passenger"),
        cell: row => PassengerName({passenger: row.rooms?.[0]?.passengers?.[0]}) || t("None")
    },
    {
        header: t("Dates"),
        cell: row => new Date(row.checkOutDate) <= 0 ? t("None") :
            <>{dateFormat.c(row.checkInDate)}&nbsp;—<br/> {dateFormat.c(row.checkOutDate)}</>
    },
    {
        header: t("Payment"),
        cell: row => <>
            <span class={getClassByStatus(row.paymentStatus)}>
                {remapStatus(row.paymentStatus)}
            </span>
            <br/>
            <span class="payment-amount">
                {price(row.price)}
            </span>
        </>
    },
    {
        header: t("Deadline"),
        cell: row => <>{row.deadline ? dateFormat.c(row.deadline) : t("None")}</>
    },
    {
        header: t("Status"),
        cell: row => (
            <span class={getClassByStatus(row.status)}>
                {remapStatus(row.status)}
            </span>
        )
    }
];

export const Sorters = t => [
    {
        title: t("Creation Date"),
        sorter: v => v.id
    },
    {
        title: t("Creation (old first)"),
        sorter: v => -v.id
    },
    {
        title: t("Agent"),
        sorter: v => v.agent?.lastName
    },
    {
        title: t("Deadline"),
        sorter: v => new Date(v.deadline)
    },
    {
        title: t("Check In Date"),
        sorter: v => new Date(v.checkInDate)
    },
    {
        title: t("Status"),
        sorter: v => v.status
    },
    {
        title: t("Amount"),
        sorter: v => v.price.amount
    }
];

export const Searches = v => [
    v.referenceCode,
    v.accommodationName,
    v.countryName,
    v.localityName,
    v.boardBasis,
    v.status,
    v.mealPlan,
    v.contractType,
    PassengerName({passenger: v.rooms?.[0]?.passengers?.[0]}),
    remapStatus(v.paymentStatus),
    v.agent?.firstName,
    v.agent?.lastName
];
