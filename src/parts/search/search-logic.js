import store from "stores/accommodation-store";
import { API, session } from "core";
import moment from "moment";
import { countPassengers } from "./search-ui-helpers";
import { FORM_NAMES } from "components/form";

import UI from "stores/ui-store";

const searchFormFormatter = values => {
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

    var body = {
        filters: "Default",
        checkInDate: moment(values.checkInDate).utc(true).format(),
        checkOutDate: moment(values.checkOutDate).utc(true).format(),
        roomDetails: roomDetails,
        location: {
            predictionResult: values.predictionResult,
            coordinates: {
                latitude: 0,
                longitude: 0
            },
            distance: (parseInt(values.radius) || 0) * 1000
        },
        nationality: values.nationalityCode,
        residency: values.residencyCode
    };

    if (values.advancedSearch) {
        body.ratings = values.ratings;
        body.propertyTypes = values.propertyTypes;
    }

    return body;
};

export const loadCurrentSearch = (page = 0, callback = () => {}) => {
    //todo: prevent multithread loader
    //todo: prevent page loading over result loading
    const PAGE_SIZE = 10;

    API.get({
        url: API.A_SEARCH_ONE_RESULT(store.search.id),
        body: {
            $top: PAGE_SIZE,
            $skip: page*PAGE_SIZE,
            ...(store.filtersLine ? {$filter: store.filtersLine} : {}),
            ...(store.sorterLine ? {$orderBy: store.sorterLine} : {})
        },
        success: result => {
            callback();
            store.setSearchResult(result, page);
        },
        error: () => {
            store.setSearchIsLoading(false);
        }
    });
};

export const loadCurrentSearchWithNewFilters = values => {
    store.setSelectedFilters(values);
    loadCurrentSearch();
    store.setSearchIsLoading("__filter_tmp");
};

export const loadCurrentSearchWithNewOrder = values => {
    store.setSorter(values);
    loadCurrentSearch();
    store.setSearchIsLoading("__filter_tmp");
};

export const createSearch = values => {
    store.setSearchResultLength(0, undefined);

    store.setSearchResult(null);
    session.google.clear();

    var body = searchFormFormatter(values);

    UI.dropFormCache(FORM_NAMES.AccommodationFiltersForm);
    store.setSelectedFilters(null);
    store.setSearchIsLoading(true);
    API.post({
        url: API.A_SEARCH_ONE_CREATE,
        body: body,
        success: result => {
            var status = "Unknown";
            store.setSearchId(result);

            const loader = (data) => {
                if ("Failed" == data.taskState) {
                    store.setSearchIsLoading(false);
                    return;
                }
                if (store.search?.length !== data.resultCount || store.search?.status !== data.taskState) {
                    loadCurrentSearch(0, () => {
                        store.setSearchResultLength(data.resultCount, data.taskState);
                    });
                }
            };

            const getter = (deep) => {
                if (deep > 180) {
                    store.setSearchIsLoading(false);
                    return;
                }
                setTimeout(() => API.get({
                    url: API.A_SEARCH_ONE_CHECK(store.search.id),
                    success: data => {
                        status = data.taskState;
                        if ("PartiallyCompleted" == status || "Completed" == status || "Failed" == status)
                            loader(data);
                        if ("Pending" == status || "Running" == status || "PartiallyCompleted" == status)
                            getter(deep+1);
                    },
                    error: () => {
                        store.setSearchIsLoading(false);
                    }
                }), 1000);
            };
            getter();

        },
        error: () => {
            store.setSearchIsLoading(false);
        }
    });

    store.setNewSearchRequest({
        ...body,
        destination: values.predictionDestination,
        adultsTotal: countPassengers(values, "adultsNumber"),
        childrenTotal: countPassengers(values, "childrenNumber")
    });
};

