import { SEARCH_STATUSES } from "enum";
import { $accommodation } from "stores";

export const searchCheckAndFix = () => {
    if (!$accommodation?.search)
        return;
    const { search } = $accommodation;
    if (search.loading)
        $accommodation.setSearchIsLoading(false);
    if (SEARCH_STATUSES.STARTED === search.taskState)
        $accommodation.updateSearchResultStatus({ taskState: SEARCH_STATUSES.BROKEN });
};
