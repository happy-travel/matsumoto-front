const atLeastOne = (obj) => {
    var result = false;
    for (var i in obj)
        if (obj.hasOwnProperty(i))
            result = result || obj[i];
    return result;
};

export const createFilters = (response) => {
    var filters = {
            price: {
                min: Infinity,
                max: 0,
                currency: ""
            },
            mealPlans: new Set(),
            ratings: new Set()
        },
        hotels = response?.results,
        mapPoints = [];

    if (!hotels?.length)
        return null;

    for (var i = 0; i < hotels.length; i++) {
        var hotel = hotels[i];

        mapPoints.push({
            lat: hotel?.accommodationDetails?.location?.coordinates.latitude,
            lng: hotel?.accommodationDetails?.location?.coordinates.longitude,
            id: hotel?.accommodationDetails?.id
        });
        //todo: when we create a map, use this array

        filters.ratings.add(hotel?.accommodationDetails?.rating);

        for (var j=0; j < hotel.agreements.length; j++) {
            var item = hotel.agreements[j];
            filters.price.min = Math.min(filters.price.min, item.price.netTotal);
            filters.price.max = Math.max(filters.price.max, item.price.netTotal);
            filters.price.currency = item.price.currency;

            filters.mealPlans.add(item.boardBasisCode);
        }
    }

    filters.price.min = Math.trunc(filters.price.min);
    filters.price.max = Math.ceil(filters.price.max);
    filters.mealPlans = [...filters.mealPlans];
    filters.ratings = [...filters.ratings];

    return filters;
};

export const applyFilters = (hotels, filters) => {
    if (!hotels)
        return null;

    if (!filters)
        return hotels;

    var result = hotels;

    if (atLeastOne(filters.ratings))
        result = result.filter(hotel => filters.ratings[hotel?.accommodationDetails?.rating]);

    result = JSON.parse(JSON.stringify(result));

    if (atLeastOne(filters.price) && filters.price.min > 0 && filters.price.max < Infinity)
        for (var i = 0; i < result.length; i++)
            if (result[i].agreements?.length)
                result[i].agreements = result[i].agreements.filter(item => (
                    item.price.netTotal >= filters.price.min &&
                    item.price.netTotal <= filters.price.max
                ));

    if (atLeastOne(filters.mealPlans))
        for (i = 0; i < result.length; i++)
            if (result[i].agreements?.length)
                result[i].agreements = result[i].agreements.filter(item => filters.mealPlans[item.boardBasisCode]);

    result = result.filter(hotel => hotel.agreements.length);

    return result;
};
