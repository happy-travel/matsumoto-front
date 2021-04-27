export const countPassengers = (values, field) => {
    let result = 0,
        rooms = values?.roomDetails || values?.rooms;
    for (let i = 0; i < rooms?.length; i++) {
        if (!field || "childrenNumber" == field)
            result += (rooms[i].childrenAges?.length || 0);
        if (!field || "adultsNumber" == field)
            result += rooms[i].adultsNumber;
    }
    return result;
};
