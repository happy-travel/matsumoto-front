import { API, session } from "core";
import { redirect } from "core";
import { countPassengers } from "simple/logic";
import { SEARCH_STATUSES } from "enum";
import { MODALS } from "enum/modals-enum";
import { searchFormFormatter } from "./search-form-formatter";
import { $accommodation, $personal, $view } from "stores";

export const searchCreate = (values, formik) => {
    $view.setOpenDropdown(null);

    if (values.predictionDestination != values.destination)
        formik.setFieldValue("destination", values.predictionDestination);

    if (!$personal.permitted("AccommodationAvailabilitySearch"))
        return $view.setModal(MODALS.READ_ONLY);

    const body = searchFormFormatter(values);
    $accommodation.setNewSearchRequest({
        ...body,
        destination: values.predictionDestination,
        adultsTotal: countPassengers(values, "adultsNumber"),
        childrenTotal: countPassengers(values, "childrenNumber")
    });

    session.google.clear();

    API.post({
        url: API.A_SEARCH_ONE_CREATE,
        body,
        success: result => $accommodation.setSearchId(result),
        error: () => $accommodation.updateSearchResultStatus({ taskState: SEARCH_STATUSES.BROKEN })
    });
    redirect("/search");
};
