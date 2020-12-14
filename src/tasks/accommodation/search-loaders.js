import store from "stores/accommodation-store";
import { API } from "core";

export const searchLoader = (page = 0, callback = () => {}) => {
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

export const searchLoaderWithNewFilters = values => {
    var filters = store.filtersLine;
    store.setSelectedFilters(values);
    if (filters != store.filtersLine) {
        searchLoader();
        store.setSearchIsLoading("__filter_tmp");
    }
};

export const searchLoaderWithNewOrder = values => {
    store.setSorter(values);
    searchLoader();
    store.setSearchIsLoading("__filter_tmp");
};
