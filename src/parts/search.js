import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, session, dateFormat, plural } from "core";

import { Redirect } from "react-router-dom";
import { CachedForm, FieldText, FieldSelect } from "components/form";
import Flag from "components/flag";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";

import RegionDropdown, { regionInputChanged } from "components/form/dropdown/region";
import DateDropdown from "components/form/dropdown/date";
import PeopleDropdown from "components/form/dropdown/room-details";
import DestinationDropdown from "../components/form/dropdown/destination";
import { accommodationSearchValidator } from "components/form/validation";
import { Stars } from "components/simple";
import moment from "moment";

const sum = (formik, field) => {
    var result = 0;
    for (var i = 0; i < formik.values.roomDetails.length; i++)
        result += formik.values.roomDetails[i][field];
    return result;
};
const maximumRoomsPerQuery = 5,
      maximumPeoplePerQuery = 9,
      validateFilterQuery = (form) => {
          const countPeoples = form.roomDetails?.reduce((acc, currentValue) => acc + currentValue.adultsNumber + currentValue.childrenNumber, 0);
          return form.roomDetails?.length <= maximumRoomsPerQuery && countPeoples <= maximumPeoplePerQuery;
      };

@observer
class AccommodationSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToVariantsPage: false
        };
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
        this.setDestinationAutoComplete = this.setDestinationAutoComplete.bind(this);
    }

    submit(values) {
        //todo: setSubmitting, loading
        const isValidFilterQuery = validateFilterQuery(values);
        store.setNewSearchDestination(values.destination);
        store.setSearchResult(null);
        session.google.clear();
        store.setIsInvalidFilterQuery(isValidFilterQuery);

        var body = {
            filters: "Default",
            checkInDate: values.checkInDate,
            checkOutDate: values.checkOutDate,
            roomDetails: values.roomDetails,
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

        if (isValidFilterQuery) {
            store.setSearchIsLoading(true);

            // todo: temporary adults workaround
            for (var i = 0; i < body.roomDetails.length; i++) {
                body.roomDetails[i].adultsNumber = body.roomDetails[i].adultsNumber + body.roomDetails[i].childrenNumber;
                body.roomDetails[i].childrenNumber = 0;
                body.roomDetails[i].childrenAges = [];
            }

            API.post({
                url: API.A_SEARCH_STEP_ONE,
                body: body,
                success: (result) => {
                    store.setSearchResult(result);
                },
                error: (error) => {
                    // todo: handle
                },
                after: () => {
                    store.setSearchIsLoading(false);
                }
            });
        }
        this.setState({
            redirectToVariantsPage: true
        });
    }

    destinationInputChanged(e, props) {
        var query = e.target.value;
        if (!query)
            return UI.setCountries([]);
        if (props.formik)
            props.formik.setFieldValue('destinationSelected', false);

        API.get({
            url: API.LOCATION_PREDICTION,
            body: {
                query,
                sessionId: session.google.create()
            },
            after: (data) => {
                UI.setDestinationSuggestions(data);
            }
        });
    }

    reset(formik) {
        formik.resetForm();
        store.setNewSearchDestination("");
    }

    componentDidUpdate() {
        if (this.state.redirectToVariantsPage)
            this.setState({
                redirectToVariantsPage: false
            });
    }

    setCountryValue(country, formik, connected) {
        const anotherField = {
            "residency": "nationality",
            "nationality": "residency"
        };

        UI.setCountries([]);
        formik.setFieldValue(connected, country.name);
        formik.setFieldValue(`${connected}Code`, country.code);
        formik.setFieldValue(`${connected}Selected`, true);

        if (!formik.values[anotherField[connected]]) {
            formik.setFieldValue(anotherField[connected], country.name);
            formik.setFieldValue(`${anotherField[connected]}Code`, country.code);
            formik.setFieldValue(`${anotherField[connected]}Selected`, true);
        }
    }

    setDestinationValue(item, formik) {
        formik.setFieldValue("predictionResult", {
            "id": item.id,
            "sessionId": session.google.current(),
            "source": item.source,
            "type": item.type
        });
        UI.setDestinationSuggestions([]);
        UI.setSuggestion('destination');
        formik.setFieldValue('destination', item.value);
        formik.setFieldValue('destinationSelected', true); // set for pass validation
    }

    setDestinationAutoComplete(formik) {
        const item = UI.suggestions.destination?.suggestionExtendInfo;
        if (item) {
            this.setDestinationValue(item, formik);
        }
    }

    render() {
        var { t } = useTranslation();

        return (

            <div class="search block">
                { this.state.redirectToVariantsPage && <Redirect to="/search"/> }
                <section>
                    {/* todo: remove the following hack and make back parser for query */}
                    <div class="hide">
                        {'' + UI.advancedSearch}
                        {'' + UI.countries}
                        {'' + UI.destinations}
                        {JSON.stringify(store.suggestion)}
                    </div>
                    <CachedForm
                        id="SearchForm"
                        initialValues={{
                            destination: "",
                            destinationSelected: false,
                            residency: "",
                            residencyCode: "",
                            residencySelected: false,
                            nationality: "",
                            nationalityCode: "",
                            nationalitySelected: false,

                            // Second part:
                            checkInDate: moment().utc().startOf("day"),
                            checkOutDate: moment().utc().startOf("day").add(1, "d"),
                            roomDetails: [
                                {
                                    "adultsNumber": 2,
                                    "childrenNumber": 0
                                }
                            ],

                            // Advanced search:
                            propertyTypes: "Any",
                            ratings: "Unknown",
                            availability: "all",
                            address: "",
                            radius: "",
                            order: "room"
                        }}
                        validationSchema={accommodationSearchValidator}
                        onSubmit={this.submit}
                        render={formik => (
                            <React.Fragment>
                                <div class="form">
                                    <div class="row">
                                        <FieldText formik={formik}
                                                   id="destination"
                                                   additionalFieldForValidation="destinationSelected"
                                                   label={t("Destination, Hotel name, Location or Landmark")}
                                                   placeholder={t("Choose your Destination, Hotel name, Location or Landmark")}
                                                   Icon={<span class="icon icon-hotel" />}
                                                   Flag={false}
                                                   Dropdown={DestinationDropdown}
                                                   options={UI.destinations}
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
                                                       formik.setFieldValue("checkInDate", moment(range.start).add(1, 'd'));
                                                       formik.setFieldValue("checkOutDate", moment(range.end).add(1, 'd'));
                                                   }}
                                                   options={moment.range(
                                                       moment(formik.values.checkInDate).local().startOf('day'),
                                                       moment(formik.values.checkOutDate).local().endOf('day')
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
                                                          [plural(t, sum(formik, "adultsNumber"), "Adult"),
                                                           plural(t, sum(formik, "childrenNumber"), "Children"),
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
                                                   additionalFieldForValidation="nationalitySelected"
                                                   label={t("Nationality")}
                                                   placeholder={t("Choose your nationality")}
                                                   clearable
                                                   Flag={<Flag code={formik.values.nationalityCode} />}
                                                   Dropdown={RegionDropdown}
                                                   onChange={regionInputChanged}
                                                   options={UI.countries}
                                                   setValue={this.setCountryValue}
                                                   addClass="size-large"
                                                   onClear={() => formik.setFieldValue("nationalityCode", '')}
                                        />
                                        <FieldText formik={formik}
                                                   id="residency"
                                                   additionalFieldForValidation="residencySelected"
                                                   label={t("Residency")}
                                                   placeholder={t("Choose your residency")}
                                                   clearable
                                                   Flag={<Flag code={formik.values.residencyCode} />}
                                                   Dropdown={RegionDropdown}
                                                   options={UI.countries}
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
                                    <button type="button" class="button-clear" onClick={() => this.reset(formik)}>
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
