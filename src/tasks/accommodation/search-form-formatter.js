import moment from "moment";
import authStore from "stores/auth-store";

export const searchFormFormatter = values => {
    var roomDetails = [];
    for (var i = 0; i < values.roomDetails.length; i++) {
        var room = {
            adultsNumber: values.roomDetails[i].adultsNumber,
            childrenNumber: values.roomDetails[i].childrenAges.length
        };
        if (values.roomDetails[i].childrenAges.length) {
            room.childrenAges = [];
            for (var j = 0; j < values.roomDetails[i].childrenAges.length; j++)
                room.childrenAges.push(values.roomDetails[i].childrenAges[j] || 12);
        }
        roomDetails.push(room);
    }

    return {
        checkInDate: moment(values.checkInDate).utc(true).format(),
        checkOutDate: moment(values.checkOutDate).utc(true).format(),
        roomDetails: roomDetails,
        ...(authStore.settings.newPredictions ? {} : {
            location: {
                predictionResult: values.htIds
            }
        }),
        nationality: values.nationalityCode,
        residency: values.residencyCode,
        ...(!authStore.settings.newPredictions ? {} : {
            htIds: values.htIds
        }),
    };
};
