import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, session } from "core";
import { dateFormat, Stars } from "simple";

import { Redirect } from "react-router-dom";
import { CachedForm, FORM_NAMES, FieldText, FieldSelect } from "components/form";
import FieldCountry, { searchFormSetDefaultCountries } from "components/active/field-country";
import { accommodationSearchValidator } from "components/form/validation";

import DateDropdown from "components/form/dropdown/date";
import PeopleDropdown from "components/form/dropdown/room-details";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";
import View from "stores/view-store";
import authStore from "stores/auth-store";

import { loadCurrentSearch } from "./accommodation-search-common-logic";
import FieldDestination from "../components/active/field-destination";

const sum = (values, field) => {
    var result = 0;
    for (var i = 0; i < values.roomDetails.length; i++) {
        if ("childrenNumber" == field)
            result += values.roomDetails[i].childrenAges.length;
        else
            result += values.roomDetails[i][field];
    }
    return result;
};

const formFormatter = (values) => {
    var roomDetails = [];
    for (var i = 0; i < values.roomDetails.length; i++) {
        var room = {
            adultsNumber: values.roomDetails[i].adultsNumber,
            childrenNumber: values.roomDetails[i].childrenAges.length
        };
        if (values.roomDetails[i].childrenAges.length) {
            room.childrenAges = [];
            for (var j = 0; j < values.roomDetails[i].childrenAges.length; j++)
                room.childrenAges.push(values.roomDetails[i].childrenAges[j] || 12);
        }
        roomDetails.push(room);
    }

    var body = {
        filters: "Default",
        checkInDate: moment(values.checkInDate).utc(true).format(),
        checkOutDate: moment(values.checkOutDate).utc(true).format(),
        roomDetails: roomDetails,
        location: {
            predictionResult: values.predictionResult,
            coordinates: {
                latitude: 0,
                longitude: 0
            },
            distance: (parseInt(values.radius) || 0) * 1000
        },
        nationality: values.nationalityCode,
        residency: values.residencyCode
    };

    if (UI.advancedSearch) {
        body.ratings = values.ratings;
        body.propertyTypes = values.propertyTypes;
    }

    return body;
};

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

        store.setSearchResultLength(0, undefined);

        store.setSearchResult(null);
        session.google.clear();

        var body = formFormatter(values);

        store.setSearchIsLoading(true);
        API.post({
            url: API.A_SEARCH_ONE_CREATE,
            body: body,
            success: result => {
                var status = "Unknown";
                store.setSearchRequestId(result);

                const loader = (data) => {
                    if ("Failed" == data.taskState) {
                        store.setSearchIsLoading(false);
                        return;
                    }
                    if (store.search?.length !== data.resultCount || store.search?.status !== data.taskState) {
                        loadCurrentSearch(0, () => {
                            store.setSearchResultLength(data.resultCount, data.taskState);
                        });
                    }
                };

                const getter = (deep) => {
                    if (deep > 180) {
                        store.setSearchIsLoading(false);
                        return;
                    }
                    setTimeout(() => API.get({
                        url: API.A_SEARCH_ONE_CHECK(store.search.requestId),
                        success: data => {
                            status = data.taskState;
                            if ("PartiallyCompleted" == status || "Completed" == status || "Failed" == status)
                                loader(data);
                            if ("Pending" == status || "Running" == status || "PartiallyCompleted" == status)
                                getter(deep+1);
                        },
                        error: () => {
                            store.setSearchIsLoading(false);
                        }
                    }), 1000);
                };
                getter();

            },
            error: () => {
                store.setSearchIsLoading(false);
            }
        });

        store.setNewSearchRequest({
            ...body,
            destination: values.predictionDestination,
            adultsTotal: sum(values, "adultsNumber"),
            childrenTotal: sum(values, "childrenNumber")
        });

        this.setState({
            redirectToVariantsPage: true
        });
    }

    componentDidUpdate() {
        if (this.state.redirectToVariantsPage)
            this.setState({
                redirectToVariantsPage: false
            });
    }

    render() {
        var { t } = useTranslation();

        return (
            <div class="search block">
                { this.state.redirectToVariantsPage && <Redirect to="/search"/> }
                <section>
                    <div class="hide">{'' + UI.advancedSearch}{JSON.stringify(store.suggestion)}</div>
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
                            ],
                            // Advanced search:
                            propertyTypes: "Any",
                            ratings: "Unknown",
                            availability: "all",
                            address: "",
                            radius: "",
                            order: "room",
                            predictionResult: null,
                            predictionDestination: ""
                        }}
                        valuesOverwrite={searchFormSetDefaultCountries}
                        validationSchema={accommodationSearchValidator}
                        onSubmit={this.submit}
                        enableReinitialize={!authStore.settings.loaded}
                        render={(formik, reset) => (
                            <React.Fragment>
                                <div class="form">
                                    <div class="row">
                                        <FieldDestination formik={formik}
                                                          id="destination"
                                                          label={t("Destination, Hotel name, Location or Landmark")}
                                                          placeholder={t("Choose your Destination, Hotel name, Location or Landmark")}
                                        />
                                        <FieldText formik={formik}
                                                   id="dates"
                                                   label={t("Check In - Check Out")}
                                                   placeholder={t("Choose date")}
                                                   Icon={<span class="icon icon-calendar"/>}
                                                   addClass="size-medium"
                                                   Dropdown={DateDropdown}
                                                   value={
                                                       dateFormat.b(formik.values.checkInDate)
                                                       + " – " +
                                                       dateFormat.b(formik.values.checkOutDate)
                                                   }
                                                   setValue={range => {
                                                       formik.setFieldValue("checkInDate", range.start);
                                                       formik.setFieldValue("checkOutDate", range.end);
                                                   }}
                                                   options={moment.range(
                                                       moment(formik.values.checkInDate),
                                                       moment(formik.values.checkOutDate)
                                                   )}
                                        />
                                        <FieldText formik={formik}
                                                   id="room"
                                                   label={t("Adults, Children, Rooms")}
                                                   placeholder={t("Choose options")}
                                                   Icon={<span class="icon icon-arrows-expand"/>}
                                                   addClass="size-medium"
                                                   Dropdown={PeopleDropdown}
                                                   value={
                                                          [__plural(t, sum(formik.values, "adultsNumber"), "Adult"),
                                                           __plural(t, sum(formik.values, "childrenNumber"), "Children"),
                                                           __plural(t, formik.values.roomDetails.length, "Room")].join(" • ")
                                                   }
                                        />
                                    </div>
                                    <div class={"row advanced" + __class(!UI.advancedSearch, "invisible")}>
                                        <FieldSelect formik={formik}
                                                     id="propertyTypes"
                                                     label={t("Property Type")}
                                                     options={[
                                                         {value: "Any", text: t("All")},
                                                         {value: "Hotels", text: t("Hotel")},
                                                         {value: "Apartments", text: t("Serviced Apartment")}
                                                     ]}
                                        />
                                        <FieldSelect formik={formik}
                                                     id="ratings"
                                                     label={t("Star Rating")}
                                                     addClass="size-large"
                                                     options={[
                                                         {value: "Unknown",    text: t("All")},
                                                         {value: "OneStar",    text: <span>{t("Economy")}  <Stars count="1" /></span>},
                                                         {value: "TwoStars",   text: <span>{t("Budget")}   <Stars count="2" /></span>},
                                                         {value: "ThreeStars", text: <span>{t("Standard")} <Stars count="3" /></span>},
                                                         {value: "FourStars",  text: <span>{t("Superior")} <Stars count="4" /></span>},
                                                         {value: "FiveStars",  text: <span>{t("Luxury")}   <Stars count="5" /></span>},
                                                         {value: "NotRated",   text: "Unrated"}
                                                     ]}
                                        />
                                        <FieldText formik={formik}
                                                   id="radius"
                                                   label={t("Radius (Km)")}
                                                   placeholder="1"
                                                   numeric
                                        />
                                        <FieldSelect formik={formik}
                                                     id="order"
                                                     label={t("Order Rates")}
                                                     options={[
                                                         {value: "room", text: t("By Room")},
                                                         {value: "rate", text: t("By Rate")}
                                                     ]}
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
                                                    {t("Search accommodation")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="additionals">
                                    {UI.advancedSearch ?
                                        <button type="button" class="button-expand reverse" onClick={() => UI.toggleAdvancedSearch()}>
                                            {t("Simple Search")}
                                        </button> :
                                        <button type="button" class="button-expand" onClick={() => UI.toggleAdvancedSearch()}>
                                            {t("Advanced Search")}
                                        </button>
                                    }
                                    <button type="button" class="button-clear" onClick={reset}>
                                        {t("Clear")}
                                    </button>
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
