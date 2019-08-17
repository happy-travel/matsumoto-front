import React from "react";
import { observer } from "mobx-react";
import { API, session, dateFormat } from "core";

import { Redirect } from "react-router-dom";
import { FieldText } from 'components/form';
import Flag from 'components/flag';

import AccommodationStore from 'stores/accommodation-store';
import CommonStore from 'stores/common-store';

import RegionDropdown from 'components/form/dropdown/region';
import DateDropdown from 'components/form/dropdown/date';
import PeopleDropdown from 'components/form/dropdown/room-details';
import DestinationDropdown from "../components/form/dropdown/destination";

@observer
class AccommodationSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToVariantsPage: false
        };
        this.submit = this.submit.bind(this);
    }

    submit() {
        AccommodationStore.setLoaded(false);
        AccommodationStore.setResult({});
        session.google.clear();
        API.post({
            url: API.ACCOMMODATION_SEARCH,
            body: AccommodationStore.request,
            success: (result) => {
                AccommodationStore.setResult(result);
            },
            error: (error) => {
                // todo: handle
            },
            after: () => {
                AccommodationStore.setLoaded(true);
            }
        });
        this.setState({
            redirectToVariantsPage: true
        });
    }

    regionInputChanged(e) {
        var query = e.target.value;
        if (!query)
            return CommonStore.setCountries([]);

        API.get({
            url: API.COUNTRIES_PREDICTION,
            body: { query },
            after: (data) => {
                CommonStore.setCountries(data || []);
            }
        });
    }

    destinationInputChanged(e) {
        var query = e.target.value;
        if (!query)
            return CommonStore.setCountries([]);

        API.get({
            url: API.LOCATION_PREDICTION,
            body: {
                query,
                sessionId: session.google.create()
            },
            after: (data) => {
                CommonStore.setDestinationSuggestions(data);
            }
        });
    }

    componentDidUpdate() {
        if (this.state.redirectToVariantsPage)
            this.setState({
                redirectToVariantsPage: false
            });
    }

    render() {
        const store = AccommodationStore;

        return (
            <div class="search block">
                { this.state.redirectToVariantsPage && <Redirect to="/search"/> }
                <section>
                    <div class="form">
                        <div class="row">
                            <FieldText
                                id={"field-destination"}
                                label={'Destination, Hotel name, Location or Landmark'}
                                placeholder={'Choose your Destination, Hotel name, Location or Landmark'}
                                Icon={<span class="icon icon-hotel" />}
                                Flag={false}
                                Dropdown={<DestinationDropdown connected={"field-destination"} />}
                                onChange={this.destinationInputChanged}
                                clearable
                            />
                            <FieldText
                                id={"field-dates"}
                                label={'Check In – Check Out'}
                                placeholder={'Choose date'}
                                Icon={<span class="icon icon-calendar"/>}
                                addClass="size-medium"
                                Dropdown={<DateDropdown />}
                                value={
                                    dateFormat.b(store.request.checkInDate)
                                    + ' – ' +
                                    dateFormat.b(store.request.checkOutDate)
                                }
                            />
                            <FieldText
                                id={"field-room"}
                                label={'Adults • Children • Rooms'}
                                placeholder={'Choose options'}
                                Icon={<span class="icon icon-arrows-expand"/>}
                                addClass="size-medium"
                                Dropdown={<PeopleDropdown />}
                                value={
                                    store.request.roomDetails[0].adultsNumber +
                                    ' Adult' + (store.request.roomDetails[0].adultsNumber > 1 ? "s" : '') + ' • ' +

                                    store.request.roomDetails[0].childrenNumber +
                                    ' Children • ' +

                                    store.request.roomDetails[0].rooms +
                                    ' Room' + (store.request.roomDetails[0].rooms > 1 ? "s" : '')
                                }
                            />
                        </div>
                        <div class="row">
                            <FieldText
                                id={"field-residency"}
                                label={'Residency'}
                                placeholder={'Choose your residency'}
                                clearable
                                Flag={false && <Flag />}
                                Dropdown={<RegionDropdown connected={"field-residency"} />}
                                onChange={this.regionInputChanged}
                                addClass="size-large"
                            />
                            <FieldText
                                id={"field-nationality"}
                                label={'Nationality'}
                                placeholder={'Choose your nationality'}
                                clearable
                                Flag={false && <Flag />}
                                Dropdown={<RegionDropdown connected={"field-nationality"} />}
                                onChange={this.regionInputChanged}
                                addClass="size-large"
                            />
                            <div class="field">
                                <div class="label"/>
                                <div class="inner">
                                    <button
                                        onClick={this.submit}
                                        class="button"
                                    >
                                        Search hotel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="additionals">
                        <button class="button-expand">
                            Advanced Search
                        </button>
                        <button class="button-clear">
                            Clear
                        </button>
                    </div>
                </section>
            </div>
        );
    }
}

export default AccommodationSearch;
