import React from "react";
import { useTranslation } from "react-i18next";

export const GroupRoomTypesAndCount = ({ contracts, solo }) => {
    const { t } = useTranslation();
    let count = {};
    let result = [];
    for (let i = 0; i < contracts.length; i++) {
        var description = (contracts[i].contractDescription || "").trim();
        if ("NotSpecified" != contracts[i].type)
            description = t(contracts[i].type) + ((description && (description != contracts[i].type)) ? (": " + description) : "");
        if (!description)
            description = t("Room");
        if (count.hasOwnProperty(description))
            count[description]++;
        else
            count[description] = 1;
    }

    if (solo)
        for (let item in count)
            return item;

    for (let item in count)
        result.push((count[item] > 1 ? (count[item] + " x ") : "") + item);

    return result.map((item, index) => <div key={index}>{item}</div>);
};
