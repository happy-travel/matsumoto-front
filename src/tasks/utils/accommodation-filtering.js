import { HOTEL_STARS } from "enum";

export const atLeastOne = (obj) => {
    if (!obj)
        return false;
    if (obj.length)
        return true;
    let result = false;
    for (let i in obj)
        if (obj.hasOwnProperty(i))
            result = result || obj[i];
    return result;
};

const TEMPORARY_MAX_PRICE = 2500;

const enabledFiltersForList = obj => Object.keys(obj).filter(v=>obj[v]).map(i=>"'"+i+"'").join(", ");

export const generateFiltersLine = filters => {
    if (!atLeastOne(filters))
        return "";

    let list = [];

    if (atLeastOne(filters.price) && (filters.price.min > 0 || filters.price.max < TEMPORARY_MAX_PRICE))
        list.push(`RoomContractSets/any(d: d/Rate/FinalPrice/Amount lt ${filters.price.max} and d/Rate/FinalPrice/Amount gt ${filters.price.min})`);

    if (atLeastOne(filters.boardBasis))
        list.push("RoomContractSets/any(rs: rs/rooms/any(r: r/BoardBasis in ("
            + enabledFiltersForList(filters.boardBasis) +
        ")))");

    if (atLeastOne(filters.ratings))
        list.push("Accommodation/Rating in ("
            + enabledFiltersForList(filters.ratings) +
        ")");

    return list.join(" and ");
};

export const generateSorterLine = sorter => {
    if (sorter?.price)
        return sorter.price > 0 ? "MinPrice desc" : "MinPrice asc";
    return "";
};

export const createFilters = hotels => {
    const filters = {
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
        ratings: HOTEL_STARS.filter(v=>v),
        __source: new Set()
    };

    for (let i = 0; i < hotels.length; i++) {
        let hotel = hotels[i];

        /* todo: when we create a map, use this array
        mapPoints.push({
            lat: hotel?.accommodation?.location?.coordinates.latitude,
            lng: hotel?.accommodation?.location?.coordinates.longitude,
            id: hotel?.accommodation?.id
        });
        */
        if (hotel?.supplier)
            filters.__source.add("" + hotel?.supplier);
    }

    filters.__source = [...filters.__source];

    return filters;
};

export const applyFilters = (hotels, filters) => {
    if (!hotels)
        return null;

    if (!filters)
        return hotels;

    let result = hotels;

    // if (atLeastOne(filters.ratings))
    //    result = result.filter(hotel => filters.ratings[hotel?.accommodation?.rating]);

    result = JSON.parse(JSON.stringify(result));

    if (atLeastOne(filters.price) && (filters.price.min > 0 || filters.price.max < TEMPORARY_MAX_PRICE))
        for (let i = 0; i < result.length; i++)
            if (result[i].roomContractSets?.length)
                result[i].roomContractSets = result[i].roomContractSets.filter(item => (
                    item.rate.finalPrice.amount >= filters.price.min &&
                    item.rate.finalPrice.amount <= filters.price.max
                ));

    if (atLeastOne(filters.boardBasis))
        for (let i = 0; i < result.length; i++)
            if (result[i].roomContractSets?.length)
                result[i].roomContractSets = result[i].roomContractSets.filter(item => filters.boardBasis[item?.rooms?.[0]?.boardBasis]);

    if (atLeastOne(filters.source))
        result = result.filter(item => filters.source[item.supplier]);

    result = result.filter(hotel => hotel.roomContractSets.length);

    return result;
};
