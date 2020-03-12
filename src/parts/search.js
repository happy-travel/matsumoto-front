import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, session, dateFormat, plural, decorate } from "core";

import { Redirect } from "react-router-dom";
import { CachedForm, FORM_NAMES, FieldText, FieldSelect } from "components/form";
import Flag from "components/flag";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";
import View from "stores/view-store";

import RegionDropdown, { regionInputChanged } from "components/form/dropdown/region";
import DateDropdown from "components/form/dropdown/date";
import PeopleDropdown from "components/form/dropdown/room-details";
import DestinationDropdown from "../components/form/dropdown/destination";
import { accommodationSearchValidator } from "components/form/validation";
import { Stars } from "components/simple";
import moment from "moment";

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
        if (values.roomDetails[i].childrenAges.length)
            room.childrenAges = values.roomDetails[i].childrenAges;
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

    // todo: temporary adults workaround
    for (i = 0; i < body.roomDetails.length; i++) {
        body.roomDetails[i].adultsNumber = body.roomDetails[i].adultsNumber + body.roomDetails[i].childrenNumber;
        body.roomDetails[i].childrenNumber = 0;
        body.roomDetails[i].childrenAges = [];
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
        this.setDestinationAutoComplete = this.setDestinationAutoComplete.bind(this);
        this.destinationInputChanged = this.destinationInputChanged.bind(this);
    }

    submit(values, formik) {
        UI.setOpenDropdown(null);
        if (values.predictionDestination != values.destination)
            formik.setFieldValue("destination", values.predictionDestination);

        //todo: setSubmitting, loading
        store.setSearchResult(null);
        session.google.clear();

        var body = formFormatter(values);

        store.setSearchIsLoading(true);
        API.post({
            url: API.A_SEARCH_STEP_ONE,
            body: body,
            success: (result) => {
                store.setSearchResult(result);
                UI.dropFormCache(FORM_NAMES.AccommodationFiltersForm)
            },
            error: (error) => {
                // todo: handle
            },
            after: () => {
                store.setSearchIsLoading(false);
            }
        });

        body.destination = values.predictionDestination;
        body.adultsTotal = sum(values, "adultsNumber");
        body.childrenTotal = sum(values, "childrenNumber");
        store.setNewSearchRequest(body);

        this.setState({
            redirectToVariantsPage: true
        });
    }

    destinationInputChanged(e, props) {
        var currentValue = e.target.value;
        if (!currentValue)
            return View.setCountries([]);

        if (props.formik)
            props.formik.setFieldValue("predictionResult", null);

        API.get({
            url: API.LOCATION_PREDICTION,
            body: {
                query: currentValue,
                sessionId: session.google.create()
            },
            after: (data) => {
                View.setDestinationSuggestions(data, currentValue);
                UI.setSuggestion("destination", currentValue, View?.destinations?.length ? View.destinations[0] : "");
                this.setDestinationAutoComplete(props.formik, true);
            }
        });
    }

    componentDidUpdate() {
        if (this.state.redirectToVariantsPage)
            this.setState({
                redirectToVariantsPage: false
            });
    }

    setCountryValue(country, formik, connected) {
        View.setCountries([]);

        const anotherField = {
            "residency": "nationality",
            "nationality": "residency"
        };
        formik.setFieldValue(connected, country.name);
        formik.setFieldValue(`${connected}Code`, country.code);

        if (!formik.values[`${anotherField[connected]}Code`]) {
            formik.setFieldValue(anotherField[connected], country.name);
            formik.setFieldValue(`${anotherField[connected]}Code`, country.code);
        }
    }

    setDestinationValue(item, formik, silent, currentValue) {
        formik.setFieldValue("predictionResult", {
            "id": item.id,
            "sessionId": session.google.current(),
            "source": item.source,
            "type": item.type
        });
        formik.setFieldValue("predictionDestination", item.value);

        if (currentValue)
            UI.setSuggestion("destination", currentValue, item);

        if (silent !== true) {
            View.setDestinationSuggestions([]);
            UI.setSuggestion('destination');
            formik.setFieldValue('destination', item.value);
        }
    }

    setDestinationAutoComplete(formik, silent, suggestion) {
        var item = UI.suggestions.destination;
        if (suggestion)
            item = { value: formik.values.destination, suggestion: suggestion.value, suggestionExtendInfo: suggestion };
        if (item)
            this.setDestinationValue(item?.suggestionExtendInfo, formik, silent, item?.value);
    }

    render() {
        var { t } = useTranslation();

        return (
            <div class="search block">
                { this.state.redirectToVariantsPage && <Redirect to="/search"/> }
                <section>
                    <div class="hide">
                        {'' + UI.advancedSearch}
                        {'' + View.countries}
                        {'' + View.destinations}
                        {JSON.stringify(store.suggestion)}
                    </div>
                    <CachedForm
                        id={ FORM_NAMES.SearchForm }
                        initialValues={{
                            destination: "",
                            residency: "",
                            residencyCode: "",
                            nationality: "",
                            nationalityCode: "",
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
                        validationSchema={accommodationSearchValidator}
                        onSubmit={this.submit}
                        render={(formik, reset) => (
                            <React.Fragment>
                                <div class="form">
                                    <div class="row">
                                        <FieldText formik={formik}
                                                   id="destination"
                                                   additionalFieldForValidation="predictionResult"
                                                   label={t("Destination, Hotel name, Location or Landmark")}
                                                   placeholder={t("Choose your Destination, Hotel name, Location or Landmark")}
                                                   Icon={<span class="icon icon-hotel" />}
                                                   Flag={false}
                                                   Dropdown={DestinationDropdown}
                                                   options={View.destinations}
                                                   setValue={this.setDestinationValue}
                                                   onChange={this.destinationInputChanged}
                                                   setAutoComplete={this.setDestinationAutoComplete}
                                                   clearable
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
                                                          [plural(t, sum(formik.values, "adultsNumber"), "Adult"),
                                                           plural(t, sum(formik.values, "childrenNumber"), "Children"),
                                                           plural(t, formik.values.roomDetails.length, "Room")].join(" • ")
                                                   }
                                        />
                                    </div>
                                    <div class={"row advanced" + ( UI.advancedSearch ? '' : " invisible" )}>
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
                                        <FieldText formik={formik}
                                                   id="nationality"
                                                   additionalFieldForValidation="nationalityCode"
                                                   label={t("Nationality")}
                                                   placeholder={t("Choose your nationality")}
                                                   clearable
                                                   Flag={<Flag code={formik.values.nationalityCode} />}
                                                   Dropdown={RegionDropdown}
                                                   onChange={regionInputChanged}
                                                   options={View.countries}
                                                   setValue={this.setCountryValue}
                                                   addClass="size-large"
                                                   onClear={() => formik.setFieldValue("nationalityCode", '')}
                                        />
                                        <FieldText formik={formik}
                                                   id="residency"
                                                   additionalFieldForValidation="residencyCode"
                                                   label={t("Residency")}
                                                   placeholder={t("Choose your residency")}
                                                   clearable
                                                   Flag={<Flag code={formik.values.residencyCode} />}
                                                   Dropdown={RegionDropdown}
                                                   options={View.countries}
                                                   setValue={this.setCountryValue}
                                                   onChange={regionInputChanged}
                                                   addClass="size-large"
                                                   onClear={() => formik.setFieldValue("residencyCode", '')}
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
