import React from "react";

export const MealPlan = ({ room, t }) => {
    if (!room?.boardBasis)
        return null;
    if ("NotSpecified" == room.boardBasis)
        return <span>{room.mealPlan}</span>;
    if ("RoomOnly" == room.boardBasis)
        return <span>{t("No Breakfast")}</span>;
    if ("AllInclusive" == room.boardBasis)
        return <span>{t(room.boardBasis)}</span>;
    if ((t(room.boardBasis) || "").toLowerCase() == (room.mealPlan || "").toLowerCase())
        return <span>{room.mealPlan}</span>;

    return <span>{t(room.boardBasis)} – {room.mealPlan}</span>;
};
