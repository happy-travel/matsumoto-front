import store from "stores/accommodation-store";
import { API } from "core";
import {
    READY_STATUSES,
    PENDING_STATUSES,
    MAXIMUM_ITERATIONS_DEPTH,
    ITERATION_TIMEOUT
} from "./search-create";

export const searchGetRooms = accommodation => {
    store.setRoomContractsSets(null, []);
    store.setSecondStepState(null);
    store.setSelectedAccommodationFullDetails(null);
    API.get({
        url: API.ACCOMMODATION_DETAILS(
            store.search.id,
            accommodation.id
        ),
        success: result => store.setSelectedAccommodationFullDetails(result)
    });

    const loader = () => {
        API.get({
            url: API.A_SEARCH_TWO_RESULT(
                store.search.id,
                accommodation.id
            ),
            success: result => {
                store.setRoomContractsSets(accommodation.id, result);
            }
        });
    };

    const getter = (deep) => {
        if (deep > MAXIMUM_ITERATIONS_DEPTH) {
            store.setSecondStepState(true);
            return;
        }
        setTimeout(() => API.get({
            url: API.A_SEARCH_TWO_CHECK(
                store.search.id,
                accommodation.id
            ),
            success: status => {
                store.setSecondStepState(status);
                if (READY_STATUSES.includes(status))
                    loader();
                if (PENDING_STATUSES.includes(status))
                    getter(deep+1);
            },
            error: () => {
                store.setSecondStepState(true);
            }
        }), ITERATION_TIMEOUT);
    };
    getter();
};

