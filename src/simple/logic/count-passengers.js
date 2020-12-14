export const countPassengers = (values, field) => {
    var result = 0;
    for (var i = 0; i < values.roomDetails.length; i++) {
        if ("childrenNumber" == field)
            result += values.roomDetails[i].childrenAges.length;
        else
            result += values.roomDetails[i][field];
    }
    return result;
};
