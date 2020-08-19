import store from "stores/accommodation-store";
import { API } from "core";

export const runSearchSecondStep = accommodation => {
    store.setSecondStepState(null);
    store.setSelectedAccommodationFullDetails(null);
    API.get({
        url: API.ACCOMMODATION_DETAILS(
            store.search.id,
            accommodation.id
        ),
        success: result => store.setSelectedAccommodationFullDetails(result)
    });

    const loader = (data) => {
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
        if (deep > 180) {
            store.setSecondStepState(true);
            return;
        }
        setTimeout(() => API.get({
            url: API.A_SEARCH_TWO_CHECK(
                store.search.id,
                accommodation.id
            ),
            success: data => {
                store.setSecondStepState(data);
                var status = data;
                if ("PartiallyCompleted" == status || "Completed" == status || "Failed" == status)
                    loader(data);
                if ("Pending" == status || "Running" == status || "PartiallyCompleted" == status)
                    getter(deep+1);
            },
            error: () => {
                store.setSecondStepState(true);
            }
        }), 1000);
    };
    getter();
};

