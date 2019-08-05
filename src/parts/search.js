import React from "react";
import { observer } from "mobx-react";

import { Link } from "react-router-dom";
import { FieldText } from 'components/form';
import Flag from 'components/flag';

import SearchStore from 'stores/search-store';
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
            isLoaded: false,
            result: 'empty'
        };
        this.submit = this.submit.bind(this);
    }

    submit() {
        SearchStore.setLoaded(false);
        SearchStore.setResult({});
        fetch("https://netstormingconnector-api.dev.happytravel.com/api/1.0/hotels/availability",
            {
                method: 'POST',
                body: JSON.stringify({
                    "nationality": "RU",
                    "filters": "Default",
                    "hotelIds": [],
                    "ratings": "TwoStars,ThreeStars,FourStars,FiveStars",
                    ...SearchStore.request
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    SearchStore.setResult(result);
                    SearchStore.setLoaded(true);
                    this.setState({
                        isLoaded: true,
                        result: 'good'
                    });
                },
                (error) => {
                    console.warn(error);
                    SearchStore.setLoaded(true);
                    this.setState({
                        isLoaded: true,
                        result: 'bad'
                    });
                }
            );
    }

    residencyInputChanged(e, tempForceEmpty) {
        if (tempForceEmpty) {
            CommonStore.setCountries([]);
            return;
        }
        fetch("https://edo-api.dev.happytravel.com/api/1.0/locations/countries?languageCode=en&query=" + e.target.value,
            {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    CommonStore.setCountries(result);
                },
                (error) => {
                    CommonStore.setCountries([]);
                }
            );
    }

    destinationInputChanged(e, tempForceEmpty) {
        if (tempForceEmpty) {
            CommonStore.setCountries([]);
            return;
        }
        var session = window.sessionStorage.getItem('google-session');
        if (!session) {
            const uuidv4 = require('uuid/v4');
            session = uuidv4();
            window.sessionStorage.setItem('google-session', session);
        }

        fetch("https://edo-api.dev.happytravel.com/api/1.0/locations/predictions?languageCode=en&session=" + session + "&query=" + e.target.value,
            {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    CommonStore.setDestinationSuggestions(result);
                },
                (error) => {
                    CommonStore.setDestinationSuggestions(null);
                }
            );
    }

    render() {
        var {
        } = this.props;

        const store = SearchStore;
        return (
            <div class="search block">
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
                                    store.request.checkInDate.substr(0,10).replace('-', '/').replace('-', '/')
                                    + ' – ' +
                                    store.request.checkOutDate.substr(0,10).replace('-', '/').replace('-', '/')
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
                                onChange={this.residencyInputChanged}
                                addClass="size-large"
                            />
                            <FieldText
                                id={"field-nationality"}
                                label={'Nationality'}
                                placeholder={'Choose your nationality'}
                                clearable
                                Flag={false && <Flag />}
                                Dropdown={<RegionDropdown connected={"field-nationality"} />}
                                onChange={this.residencyInputChanged}
                                addClass="size-large"
                            />
                            <div class="field">
                                <div class="label"/>
                                <div class="inner">
                                    <Link to="/search">
                                        <button
                                            onClick={
                                                this.submit
                                            }
                                            class="button">
                                            Search hotel
                                        </button>
                                    </Link>
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
