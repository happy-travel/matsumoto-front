import { hotelStars } from "simple";

const atLeastOne = (obj) => {
    if (!obj)
        return false;
    if (obj.length)
        return true;
    var result = false;
    for (var i in obj)
        if (obj.hasOwnProperty(i))
            result = result || obj[i];
    return result;
};

const TEMPORARY_MAX_PRICE = 2500;

const enabledFiltersForList = obj => Object.keys(obj).filter(v=>obj[v]).map(i=>"'"+i+"'").join(", ");

export const generateFiltersLine = filters => {
    if (!atLeastOne(filters))
        return "";

    var list = [];

    if (atLeastOne(filters.price) && (filters.price.min > 0 || filters.price.max < TEMPORARY_MAX_PRICE))
        list.push(`Data/RoomContractSets/any(d: d/Price/NetTotal lt ${filters.price.max} and d/Price/NetTotal gt ${filters.price.min})`);

    if (atLeastOne(filters.boardBasis))
        list.push("Data/RoomContractSets/any(rs: rs/roomContracts/any(r: r/BoardBasis in ("
            + enabledFiltersForList(filters.boardBasis) +
        ")))");

    if (atLeastOne(filters.ratings))
        list.push("Data/AccommodationDetails/Rating in ("
            + enabledFiltersForList(filters.ratings) +
        ")");

    return list.join(" and ");
};

export const createFilters = hotels => {
    var filters = {
            price: {
                min: 0,
                max: TEMPORARY_MAX_PRICE,
                currency: "USD"
            },
            boardBasis: [
                "RoomOnly",
                "SelfCatering",
                "BedAndBreakfast",
                "HalfBoard",
                "FullBoard",
                "AllInclusive"
            ],
            ratings: hotelStars.filter(v=>v),
            __source: new Set()
        };

    for (var i = 0; i < hotels.length; i++) {
        var hotel = hotels[i];

        /* todo: when we create a map, use this array
        mapPoints.push({
            lat: hotel?.accommodationDetails?.location?.coordinates.latitude,
            lng: hotel?.accommodationDetails?.location?.coordinates.longitude,
            id: hotel?.accommodationDetails?.id
        });
        */

        filters.__source.add("" + hotel?.source);
    }

    filters.__source = [...filters.__source];

    return filters;
};

export const applyFilters = (hotels, filters) => {
    if (!hotels)
        return null;

    if (!filters)
        return hotels;

    var result = hotels;

    // if (atLeastOne(filters.ratings))
    //    result = result.filter(hotel => filters.ratings[hotel?.accommodationDetails?.rating]);

    result = JSON.parse(JSON.stringify(result));

    if (atLeastOne(filters.price) && (filters.price.min > 0 || filters.price.max < TEMPORARY_MAX_PRICE))
        for (var i = 0; i < result.length; i++)
            if (result[i].roomContractSets?.length)
                result[i].roomContractSets = result[i].roomContractSets.filter(item => (
                    item.price.netTotal >= filters.price.min &&
                    item.price.netTotal <= filters.price.max
                ));

    if (atLeastOne(filters.boardBasis))
        for (i = 0; i < result.length; i++)
            if (result[i].roomContractSets?.length)
                result[i].roomContractSets = result[i].roomContractSets.filter(item => filters.boardBasis[item?.roomContracts?.[0]?.boardBasis]);

    if (atLeastOne(filters.source))
        result = result.filter(item => filters.source[item.source]);

    result = result.filter(hotel => hotel.roomContractSets.length);

    return result;
};
