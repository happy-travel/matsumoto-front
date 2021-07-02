import { API, redirect } from "core";
import { SEARCH_STATUSES } from "enum";
import { $accommodation } from "stores";

const POLLING_DURATION = 10 * 60 * 1000;
const REQUEST_INTERVAL = 1000;
let throttle = false;

const requestRooms = (roomsTaskState) => {
    const { search, selected } = $accommodation;

    if (throttle || (SEARCH_STATUSES.isFinished(search.roomsTaskState)))
        return;
    throttle = true;

    API.get({
        url: API.A_SEARCH_TWO_RESULT(
            search.id,
            selected.accommodationFullDetails.htId
        ),
        success: result => {
            $accommodation.setRoomsTaskState(roomsTaskState);
            $accommodation.selectSearchResultAccommodation(selected.accommodation.id, result);
        },
        error: () => {
            $accommodation.setRoomsTaskState(SEARCH_STATUSES.BROKEN);
        },
        after: () => {
            throttle = false;
        }
    });
};

const subscribeSearchRoomsResults = () =>
    setInterval(() => {
        const { search, selected } = $accommodation;

        if (!search.id || !selected?.accommodationFullDetails?.htId || !SEARCH_STATUSES.isPending(search.roomsTaskState))
            return;

        if (search.roomsLastCheckedAt - search.roomsCreatedAt > POLLING_DURATION) {
            $accommodation.setRoomsTaskState(SEARCH_STATUSES.TIMEOUT);
            return;
        }

        API.get({
            url: API.A_SEARCH_TWO_CHECK(
                search.id,
                selected.accommodationFullDetails.htId
            ),
            success: roomsTaskState => {
                if (SEARCH_STATUSES.isReadyToLoad(roomsTaskState))
                    requestRooms(roomsTaskState);
                else
                    $accommodation.setRoomsTaskState(roomsTaskState);
            },
            error: () => {
                $accommodation.setRoomsTaskState(SEARCH_STATUSES.BROKEN);
            }
        });
    }, REQUEST_INTERVAL);


const searchRoomsCreate = accommodation => {
    $accommodation.selectSearchResultAccommodation(accommodation.id);
    API.get({
        url: API.ACCOMMODATION_DETAILS(
            $accommodation.search.id,
            accommodation.htId
        ),
        success: result => $accommodation.setSelectedAccommodationFullDetails(result)
    });
    redirect("/search/contract");
};

export {
    subscribeSearchRoomsResults,
    searchRoomsCreate
}