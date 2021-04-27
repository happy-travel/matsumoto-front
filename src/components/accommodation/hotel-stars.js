import React from "react";
import { HOTEL_STARS } from "enum";

const HotelStars = ({ count }) => {
    let result = HOTEL_STARS.indexOf(count);
    if (parseInt(count) >= 1)
        result = parseInt(count);
    if (result < 1)
        return null;

    return (
        <span className="stars">
            {[...Array(result)].map((value, index) => <i key={index} />)}
        </span>
    );
};

export default HotelStars;
