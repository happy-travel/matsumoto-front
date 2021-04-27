import { API } from "core";
import { SEARCH_STATUSES } from "enum";
import { $accommodation } from "stores";

const POLLING_DURATION = 10 * 60 * 1000;
const REQUEST_INTERVAL = 1000;
const PAGE_SIZE = 10;

const requestSearchResultsPage = (page = 0, callback = () => {}) => {
    const { search, filtersLine, sorterLine } = $accommodation;

    if (!search.id)
        return;

    API.get({
        url: API.A_SEARCH_ONE_RESULT(search.id),
        body: {
            $top: PAGE_SIZE,
            $skip: page * PAGE_SIZE,
            ...(filtersLine ? { $filter: filtersLine } : {}),
            ...(sorterLine ? { $orderBy: sorterLine } : {})
        },
        success: result => {
            callback();
            $accommodation.setSearchResult(result, page);
        },
        error: () => $accommodation.updateSearchResultStatus({ taskState: SEARCH_STATUSES.BROKEN })
    });
};

const subscribeSearchResults = () =>
    setInterval(() => {
        const { search } = $accommodation;

        if (!search.id || !SEARCH_STATUSES.isPending(search.taskState))
            return;

        if (search.lastCheckedAt - search.createdAt > POLLING_DURATION) {
            $accommodation.updateSearchResultStatus({ taskState: SEARCH_STATUSES.TIMEOUT });
            return;
        }

        API.get({
            url: API.A_SEARCH_ONE_CHECK(search.id),
            success: data => {
                $accommodation.searchChecked();
                if (SEARCH_STATUSES.isReadyToLoad(data.taskState)) {
                    if ((!data.resultCount && SEARCH_STATUSES.isFinished(data.taskState))) {
                        $accommodation.updateSearchResultStatus(data);
                        return;
                    }
                    if (search.resultCount != data.resultCount || search.taskState !== data.taskState) {
                        requestSearchResultsPage(0, () => {
                            $accommodation.updateSearchResultStatus(data);
                        });
                    }
                }
            },
            error: () => $accommodation.updateSearchResultStatus({ taskState: SEARCH_STATUSES.BROKEN })
        });
    }, REQUEST_INTERVAL);

const searchLoadNextPage = () => {
    requestSearchResultsPage(($accommodation.search.page || 0) + 1);
};

const searchLoadWithNewFilters = values => {
    const { filtersLine } = $accommodation;
    $accommodation.setSearchSelectedFilters(values);
    if (filtersLine != $accommodation.filtersLine) {
        $accommodation.setSearchIsLoading(true);
        requestSearchResultsPage();
    }
};

const searchLoadWithNewOrder = values => {
    $accommodation.setSearchIsLoading(true);
    $accommodation.setSearchSelectedSorter(values);
    requestSearchResultsPage();
};

export {
    subscribeSearchResults,
    searchLoadNextPage,
    searchLoadWithNewFilters,
    searchLoadWithNewOrder
};
