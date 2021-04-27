import React from "react";
import { remapStatus } from "simple";

const remapAndUpperCase = str => {
    if (!str?.includes || str.includes(" "))
        return str;
    str = remapStatus(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const Amenities = ({ hotel }) => {
    if (!hotel.accommodationAmenities?.length)
        return null;

    const list = hotel.accommodationAmenities;

    const result = [];
    for (let i = 0; i < 3; i++) {
        let sub = [];
        for (let j = 0; j < list.length; j++)
            if (i == j % 3)
                sub.push(
                    <li key={`amenity${j}`}>
                        {remapAndUpperCase(list[j])}
                    </li>
                );
        result.push(
            <ul className="allotment" key={`allotment${i}`}>
                {sub}
            </ul>
        );
    }

    return (
        <div className="amenities">
            {result}
        </div>
    );
};

export default Amenities;