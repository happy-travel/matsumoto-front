import React from "react";
import { useTranslation } from "react-i18next";

export const PassengersCount = ({ adults, children }) => {
    const { t } = useTranslation();
    let result = [];
    if (adults)
        result.push(__plural(t, adults, "Adult"));
    if (children)
        result.push(__plural(t, children, "Children"));
    return result.join(", ");
};

export const PassengerName = ({ passenger }) => (
    passenger ? (
        passenger.title + ". " + passenger.firstName + " " + passenger.lastName
    ) : ""
);
