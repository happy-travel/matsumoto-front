import React from "react";
import { dateFormat, price } from "simple";

export const RoomPrices = ({ t, prices }) => {
    if (!(prices && prices.length))
        return null;

    if (prices.length == 1 || !prices[0].fromDate)
        return price(prices[0].finalPrice);

    return prices.map(item => (
        <div>
            {dateFormat.c(item.fromDate)} – {dateFormat.c(item.toDate)}: {price(item.finalPrice)}
        </div>
    ));
};
