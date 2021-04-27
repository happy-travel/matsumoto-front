import React from "react";
import { date, price } from "simple";
import { Dual } from "components/simple";
import { useTranslation } from "react-i18next";

const optimize = (prices) => {
    let sorted = JSON.parse(JSON.stringify(prices));
    sorted = sorted.sort((a,b) => Number(new Date(a.fromDate)) - Number(new Date(b.fromDate)));

    let result = [],
        start = 0;
    for (let i = 0; i < sorted.length + 1; i++) {
        if (sorted[start].finalPrice.amount !== sorted[i]?.finalPrice?.amount) {
            result.push({
                fromDate: sorted[start].fromDate,
                toDate: sorted[i-1].toDate,
                finalPrice: sorted[start].finalPrice
            });
            start = i;
        }
    }

    return result;
};

const RoomPrices = ({ prices, index }) => {
    const { t } = useTranslation();

    if (!(prices && prices.length))
        return null;

    if (prices.length == 1 || !prices[0].fromDate)
        return price(prices[0].finalPrice);

    const optimized = optimize(prices);

    if (optimized.length == 1)
        return (
            <Dual
                a={t("Room") + " " + index}
                b={price(optimized[0].finalPrice) + " " + t("per Night")}
            />
        );

    return optimized.map((item, i) => (
        <Dual
            a={
                (index ? (t("Room") + " " + index + " (") : "") +
                date.format.shortDay(item.fromDate) + " – " + date.format.shortDay(item.toDate) +
                (index ? ")" : "")
            }
            b={price(item.finalPrice) + " " + t("per Night")}
            key={"z"+i}
        />
    ));
};

export default RoomPrices;
