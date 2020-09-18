import React from "react";

export const PassengersCount = ({ t, adults, children, separator }) => {
    return (
        ( adults ? __plural(t, adults, "Adult") : "" ) +
        ((adults && children) ?
            (undefined !== separator ?
                separator :
                (" " + t("and") + " ")) :
            "") +
        ( children ? __plural(t, children, "Children") : "" )
    );
};

export const PassengerName = ({ passenger }) => (
    passenger ? (
        passenger.title + ". " + passenger.firstName + " " + passenger.lastName
    ) : ""
);
