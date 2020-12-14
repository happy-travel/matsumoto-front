import { API, session } from "core";
import { countPassengers } from "simple/logic";
import { FORM_NAMES } from "components/form";
import { searchFormFormatter } from "./search-form-formatter";
import { searchLoader } from "./search-loaders";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";

export const searchCreate = values => {
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
                    searchLoader(0, () => {
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
