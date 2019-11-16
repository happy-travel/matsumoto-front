import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, session, dateFormat, plural } from "core";

import { Redirect } from "react-router-dom";
import { FieldText, FieldSelect } from "components/form";
import Flag from "components/flag";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";

import RegionDropdown, { regionInputChanged } from "components/form/dropdown/region";
import DateDropdown from "components/form/dropdown/date";
import PeopleDropdown from "components/form/dropdown/room-details";
import DestinationDropdown from "../components/form/dropdown/destination";
import { accommodationSearchValidator } from "components/form/validation";
import { Stars } from "components/simple";

import { Formik } from 'formik';

const sum = field => {
    var result = 0;
    for (var i = 0; i < store.search.rooms; i++)
        result += store.getRoomDetails(i)[field];
    return result;
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
    }

    submit(values, { setSubmitting }) {
        //todo: setSubmitting, loading
        store.setNewSearchForm(values, UI.advancedSearch);
        store.setSearchIsLoaded(false);
        store.setSearchResult(null);
        session.google.clear();

        // todo: temporary adults workaround
        var body = JSON.parse(JSON.stringify(store.search.request));
        for (var i = 0; i < body.roomDetails.length; i++) {
            body.roomDetails[i].adultsNumber = body.roomDetails[i].adultsNumber + body.roomDetails[i].childrenNumber;
            body.roomDetails[i].childrenNumber = 0;
            body.roomDetails[i].childrenAges = [];
        }

        API.post({
            url: API.ACCOMMODATION_SEARCH,
            body: body,
            success: (result) => {
                store.setSearchResult(result);
            },
            error: (error) => {
                // todo: handle
            },
            after: () => {
                store.setSearchIsLoaded(true);
            }
        });
        this.setState({
            redirectToVariantsPage: true
        });
    }

    destinationInputChanged(e) {
        var query = e.target.value;
        if (!query)
            return UI.setCountries([]);

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
        store.setNewSearchForm(null);
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
        {/* todo: remove the following hack and make back parser for query */}
        <div class="hide">
            {''+store.search.request.checkInDate}
            {''+store.search.request.checkOutDate}
            {[...Array(store.search.rooms)].map((x,i)=>JSON.stringify(store.getRoomDetails(i)))}
            {'' + UI.advancedSearch}
            {JSON.stringify(store.suggestion)}
        </div>
        <Formik
            initialValues={{
                destination: "",
                residency: "",
                nationality: "",

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
                <form onSubmit={formik.handleSubmit}>
                    <div class="form">
                        <div class="row">
                            <FieldText formik={formik}
                                id="destination"
                                label={t("Destination, Hotel name, Location or Landmark")}
                                placeholder={t("Choose your Destination, Hotel name, Location or Landmark")}
                                Icon={<span class="icon icon-hotel" />}
                                Flag={false}
                                Dropdown={DestinationDropdown}
                                onChange={this.destinationInputChanged}
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
                                    dateFormat.b(store.search.request.checkInDate)
                                        + " – " +
                                    dateFormat.b(store.search.request.checkOutDate)
                                }
                            />
                            <FieldText formik={formik}
                                id="room"
                                label={t("Adults, Children, Rooms")}
                                placeholder={t("Choose options")}
                                Icon={<span class="icon icon-arrows-expand"/>}
                                addClass="size-medium"
                                Dropdown={PeopleDropdown}
                                value={
                                    [plural(t, sum("adultsNumber"), "Adult"),
                                     plural(t, sum("childrenNumber"), "Children"),
                                     plural(t, store.search.rooms, "Room")].join(" • ")
                                }
                            /> {/* todo: values */}
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
                                id="residency"
                                label={t("Residency")}
                                placeholder={t("Choose your residency")}
                                clearable
                                Flag={false && <Flag />}
                                Dropdown={RegionDropdown}
                                onChange={regionInputChanged}
                                addClass="size-large"
                            />
                            <FieldText formik={formik}
                                id="nationality"
                                label={t("Nationality")}
                                placeholder={t("Choose your nationality")}
                                clearable
                                Flag={false && <Flag />}
                                Dropdown={RegionDropdown}
                                onChange={regionInputChanged}
                                addClass="size-large"
                            />
                            <div class="field">
                                <div class="label"/>
                                <div class="inner">
                                    <button type="submit" class="button">
                                        {t("Search hotel")}
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
                </form>
            )}
        />
    </section>
</div>

        );
    }
}

export default AccommodationSearch;
