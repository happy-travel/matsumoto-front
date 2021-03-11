import React from "react";
import { date, price } from "simple";

export const RoomPrices = ({ t, prices }) => {
    if (!(prices && prices.length))
        return null;

    if (prices.length == 1 || !prices[0].fromDate)
        return price(prices[0].finalPrice);

    return prices.map((item, index) => (
        <div key={index}>
            {date.format.c(item.fromDate)} – {date.format.c(item.toDate)}: {price(item.finalPrice)}
        </div>
    ));
};
