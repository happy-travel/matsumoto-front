import { date } from "simple";
import { $personal } from "stores";

export const searchFormValuesCorrection = values => {
    if (!values.residency || !values.residencyCode) {
        values.residency = $personal.settings.residency || "";
        values.residencyCode = $personal.settings.residencyCode || "";
    }
    if (!values.nationality || !values.nationalityCode) {
        values.nationality = $personal.settings.nationality || "";
        values.nationalityCode = $personal.settings.nationalityCode || "";
    }
    if (date.passed(values.checkInDate) ||
        date.passed(values.checkOutDate) ||
        new Date(values.checkInDate) > new Date(values.checkOutDate)) {
        values.checkInDate = new Date();
        values.checkOutDate = date.addDay(new Date(), 1);
    }
    return values;
};

export const searchFormFormatter = values => {
    let roomDetails = [];
    for (let i = 0; i < values.roomDetails.length; i++) {
        let room = {
            adultsNumber: values.roomDetails[i].adultsNumber,
            childrenNumber: values.roomDetails[i].childrenAges.length
        };
        if (values.roomDetails[i].childrenAges.length) {
            room.childrenAges = [];
            for (let j = 0; j < values.roomDetails[i].childrenAges.length; j++)
                room.childrenAges.push(parseInt(values.roomDetails[i].childrenAges[j] || 12));
        }
        roomDetails.push(room);
    }

    return {
        checkInDate: date.format.api(values.checkInDate),
        checkOutDate: date.format.api(values.checkOutDate),
        roomDetails: roomDetails,
        ...($personal.settings.experimentalFeatures ? {} : {
            location: {
                predictionResult: values.htIds
            }
        }),
        nationality: values.nationalityCode,
        residency: values.residencyCode,
        ...(!$personal.settings.experimentalFeatures ? {} : {
            htIds: values.htIds
        }),
    };
};
