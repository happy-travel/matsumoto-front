import React from "react";
import { hotelStars } from "../const/hotel-stars";

export const Stars = ({ count }) => {
    var result = hotelStars.indexOf(count);
    if (parseInt(count) >= 1) result = parseInt(count);
    if (result < 1) return null;

    return (
        <span className="stars">
            {[...Array(result)].map((value, index) => <i key={index} />)}
        </span>
    );
};
