import React from "react";

export const GroupRoomTypesAndCount = ({ t, contracts, solo }) => {
    const count = {},
        result = [];
    for (let i = 0; i < contracts.length; i++) {
        var description = (contracts[i].contractDescription || "").trim();
        if ("NotSpecified" != contracts[i].type)
            description = t(contracts[i].type) + (description ? (": " + description) : "");
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
        result.push(count[item] + " x " + item);

    return <React.Fragment>{
        result.map(item => <div>{item}</div>)
    }</React.Fragment>;
};
