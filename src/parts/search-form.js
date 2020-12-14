import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Redirect } from "react-router-dom";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import FieldCountry, { searchFormSetDefaultCountries } from "components/complex/field-country";
import FieldDestination from "components/complex/field-destination";
import FieldDatepicker from "components/complex/field-datepicker";
import { accommodationSearchValidator } from "components/form/validation";

import PeopleDropdown from "components/form/dropdown/room-details";

import { searchCreate } from "tasks/accommodation/search-create";
import { countPassengers } from "simple/logic";

import View from "stores/view-store";
import authStore from "stores/auth-store";

@observer
class AccommodationSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToVariantsPage: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values, formik) {
        View.setOpenDropdown(null);
        if (values.predictionDestination != values.destination)
            formik.setFieldValue("destination", values.predictionDestination);

        searchCreate(values);

        this.setState({
            redirectToVariantsPage: true
        });
    }

    componentDidUpdate() {
        if (this.state.redirectToVariantsPage)
            this.setState({
                redirectToVariantsPage: false
            }); // prevent redirection circle
    }

    render() {
        var { t } = useTranslation();

        return (
            <div class="search block" style={{paddingBottom: "58px"}}>
                { this.state.redirectToVariantsPage && <Redirect to="/search"/> }
                <section>
                    <div class="hide">{JSON.stringify(authStore.settings)}</div>
                    <CachedForm
                        id={ FORM_NAMES.SearchForm }
                        initialValues={{
                            destination: "",
                            residency: "", residencyCode: "",
                            nationality: "", nationalityCode: "",
                            checkInDate: moment().startOf("day"),
                            checkOutDate: moment().startOf("day").add(1, "d"),
                            roomDetails: [
                                {
                                    adultsNumber: 2,
                                    childrenAges: []
                                }
                            ]
                        }}
                        valuesOverwrite={searchFormSetDefaultCountries}
                        validationSchema={accommodationSearchValidator}
                        onSubmit={this.submit}
                        enableReinitialize={true}
                        render={formik => (
                            <React.Fragment>
                                <div class="form">
                                    <div class="row">
                                        <FieldDestination formik={formik}
                                                          id="destination"
                                                          label={t("Destination, Hotel Name, Location or Landmark")}
                                                          placeholder={t("Choose your Destination, Hotel Name, Location or Landmark")}
                                        />
                                        <FieldDatepicker formik={formik}
                                                         id="dates"
                                                         first="checkInDate"
                                                         second="checkOutDate"
                                                         label={t("Check In - Check Out")}
                                                         placeholder={t("Choose date")}
                                        />
                                        <FieldText formik={formik}
                                                   id="room"
                                                   label={t("Adults, Children, Rooms")}
                                                   placeholder={t("Choose options")}
                                                   Icon={<span class="icon icon-arrows-expand"/>}
                                                   addClass="size-medium"
                                                   Dropdown={PeopleDropdown}
                                                   value={[
                                                       __plural(t, countPassengers(formik.values, "adultsNumber"), "Adult"),
                                                       __plural(t, countPassengers(formik.values, "childrenNumber"), "Children"),
                                                       __plural(t, formik.values.roomDetails.length, "Room")
                                                   ].join(" • ")}
                                        />
                                    </div>
                                    <div class="row">
                                        <FieldCountry formik={formik}
                                                      id="nationality"
                                                      anotherField="residency"
                                                      label={t("Nationality")}
                                                      placeholder={t("Choose your nationality")}
                                                      addClass="size-large"
                                                      clearable
                                        />
                                        <FieldCountry formik={formik}
                                                      id="residency"
                                                      anotherField="nationality"
                                                      label={t("Residency")}
                                                      placeholder={t("Choose your residency")}
                                                      addClass="size-large"
                                                      clearable
                                        />
                                        <div class="field">
                                            <div class="label"/>
                                            <div class="inner">
                                                <button type="submit" class="button">
                                                    {t("Search Accommodations")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    />
                </section>
            </div>
        );
    }
}

export default AccommodationSearch;
