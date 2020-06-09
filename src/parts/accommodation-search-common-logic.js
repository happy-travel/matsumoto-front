import { API } from "core";
import store from "stores/accommodation-store";

export const loadCurrentSearch = (page = 0, callback = () => {}) => {
    //todo: prevent multithread loader
    //todo: prevent page loading over result loading
    const PAGE_SIZE = 10;

    API.get({
        url: API.A_SEARCH_ONE_RESULT(store.search.requestId),
        body: {
            top: PAGE_SIZE,
            skip: page*PAGE_SIZE,
        },
        success: result => {
            callback();
            store.setSearchResult(result, page);
        },
        after: () => {
            store.setSearchIsLoading(false);
        }
    });
};
