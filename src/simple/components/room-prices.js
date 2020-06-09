import React from "react";
import { dateFormat, price } from "simple";

export const RoomPrices = ({ t, prices }) => {
    if (!(prices && prices.length))
        return null;

    if (prices.length == 1 || !prices[0].fromDate)
        return <React.Fragment>
            {price(prices[0])}
        </React.Fragment>;

    return <React.Fragment>
        {prices.map(item => (
            <div>
                {dateFormat.c(item.fromDate)} – {dateFormat.c(item.toDate)}: {price(item)}
            </div>
        ))}
    </React.Fragment>;
};
