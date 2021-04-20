import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { CachedForm, FORM_NAMES } from "components/form";
import { accommodationSearchValidator } from "components/form/validation";
import { searchCreate } from "tasks/accommodation/search-create";
import { searchFormValuesCorrection } from "tasks/accommodation/search-form-formatter";
import SearchFormFullsizePart from "./search-form-fullsize";
import SearchFormShortPart from "./search-form-short";
import { $personal } from "stores";

const AccommodationSearchForm = observer(({ fullsize }) => {
    const { t } = useTranslation();
    return (
        <div className="search block">
            <div className="hide">{JSON.stringify($personal.settings)}</div>
            <CachedForm
                id={ FORM_NAMES.SearchForm }
                initialValues={{
                    destination: "",
                    residency: "", residencyCode: "",
                    nationality: "", nationalityCode: "",
                    checkInDate: null,
                    checkOutDate: null,
                    roomDetails: [
                        {
                            adultsNumber: 2,
                            childrenAges: []
                        }
                    ]
                }}
                valuesOverwrite={searchFormValuesCorrection}
                validationSchema={accommodationSearchValidator}
                onSubmit={searchCreate}
                enableReinitialize={true}
                render={formik => (
                    !fullsize ?
                        <SearchFormShortPart
                            formik={formik}
                        /> :
                        <section>
                            <SearchFormFullsizePart
                                formik={formik}
                            />
                        </section>
                )}
            />
        </div>
    );
});

export default AccommodationSearchForm;
