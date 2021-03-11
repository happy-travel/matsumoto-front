import React from "react";
import { date, price, PassengerName, remapStatus } from "simple";

const getClassByStatus = status => ({
    "Confirmed": "green",
    "Captured": "green",
    "Cancelled": "gray"
}[status] || "");

export const Columns = (permittedAgency) => (t, setAgentIdFilter) => [
    ...(permittedAgency ? [{
        header: t("Agent"),
        cell: row => (
            <span className="link" onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAgentIdFilter(row.agent.id);
            }}>
                {row.agent?.firstName} {row.agent?.lastName}
            </span>
        ),
    }] : []),
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
            <>{date.format.c(row.checkInDate)}&nbsp;—<br/> {date.format.c(row.checkOutDate)}</>
    },
    {
        header: t("Payment"),
        cell: row => <>
            <span className={getClassByStatus(row.paymentStatus)}>
                {remapStatus(row.paymentStatus)}
            </span>
            <br/>
            <span className="payment-amount">
                {price(row.price)}
            </span>
        </>
    },
    {
        header: t("Deadline"),
        cell: row => <>{row.deadline ? date.format.c(row.deadline) : t("None")}</>
    },
    {
        header: t("Status"),
        cell: row => (
            <span className={getClassByStatus(row.status)}>
                {remapStatus(row.status)}
            </span>
        )
    }
];

export const Sorters = (permittedAgency) =>t => [
    {
        title: t("Creation Date"),
        sorter: v => v.id
    },
    {
        title: t("Creation (old first)"),
        sorter: v => -v.id
    },
    ...(permittedAgency ? [{
        title: t("Agent"),
        sorter: v => v.agent?.lastName
    }] : []),
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
        sorter: v => v.rate.amount
    }
];

export const Searches = (permittedAgency) => v => [
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
    ...(permittedAgency ? [
        v.agent?.firstName,
        v.agent?.lastName
    ] : [])
];
