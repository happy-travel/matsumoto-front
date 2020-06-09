import React from "react";

export const PassengersCount = ({ t, adults, children, separator }) => {
    return <React.Fragment>
        { adults ? __plural(t, adults, "Adult") : "" }
        {(adults && children) ?
            (undefined !== separator ?
                separator :
                (" " + t("and") + " ")) :
            ""}
        { children ? __plural(t, children, "Children") : "" }
    </React.Fragment>;
};

export const PassengerName = ({ passenger }) => (
    passenger ? <React.Fragment>{
        passenger.title + ". " + passenger.firstName + " " + passenger.lastName
    }</React.Fragment> : null
);
