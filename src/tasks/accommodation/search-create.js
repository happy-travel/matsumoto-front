import { API, session } from "core";
import { countPassengers } from "simple/logic";
import { FORM_NAMES } from "components/form";
import { searchFormFormatter } from "./search-form-formatter";
import { searchLoader } from "./search-loaders";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";

export const STATUSES = {
    COMPLETED: "Completed",
    FAILED: "Failed",
    PARTIALLY_COMPLETED: "PartiallyCompleted",
    PENDING: "Pending",
    RUNNING: "Running"
};

export const FINISH_STATUSES = [STATUSES.COMPLETED, STATUSES.FAILED];
export const READY_STATUSES = [STATUSES.PARTIALLY_COMPLETED, ...FINISH_STATUSES];
export const PENDING_STATUSES = [STATUSES.PENDING, STATUSES.RUNNING, STATUSES.PARTIALLY_COMPLETED];

export const MAXIMUM_ITERATIONS_DEPTH = 180;
export const ITERATION_TIMEOUT = 1000;

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
                if (STATUSES.FAILED == data.taskState) {
                    store.setSearchIsLoading(false);
                    store.setSearchResultLength(data.resultCount, data.taskState);
                    return;
                }
                if (!data.resultCount && (STATUSES.COMPLETED != data.taskState))
                    return;

                if (store.search?.length != data.resultCount || store.search?.status !== data.taskState) {
                    searchLoader(0, () => {
                        store.setSearchResultLength(data.resultCount, data.taskState);
                    });
                }
            };

            const getter = (deep) => {
                if (deep > MAXIMUM_ITERATIONS_DEPTH) {
                    store.setSearchIsLoading(false);
                    return;
                }
                setTimeout(() => API.get({
                    url: API.A_SEARCH_ONE_CHECK(store.search.id),
                    success: data => {
                        status = data.taskState;
                        if (READY_STATUSES.includes(status))
                            loader(data);
                        if (PENDING_STATUSES.includes(status))
                            getter(deep+1);
                    },
                    error: () => {
                        store.setSearchIsLoading(false);
                    }
                }), ITERATION_TIMEOUT);
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
