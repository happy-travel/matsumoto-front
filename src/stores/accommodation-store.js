import React from "react";
import { observable, computed } from "mobx";
import moment from "moment";
import { session } from "core";
import autosave from "core/misc/autosave";

const copy = obj => JSON.parse(JSON.stringify(obj));
const defaultSearchForm = {
        "filters": "Default",
        "checkInDate": moment().utc().startOf("day"),
        "checkOutDate": moment().utc().startOf("day").add(3, "d"),
        "roomDetails": [
            {
                "adultsNumber": 1,
                "childrenNumber": 0,
                "rooms": 1
            }
        ],
        "location": {
            "coordinates": {
                "latitude": 0,
                "longitude": 0
            },
            "distance": 0
        },
        "nationality": "",
        "residency": ""
    };

class AccommodationStore {
    @observable
    search = {
        request: copy(defaultSearchForm),
        loaded: false,
        form: null,
        result: null
    };

    @observable
    selected = {
        variant: null,
        hotel: null
    };

    @observable
    booking = {
        request: null,
        result: null
    };

    constructor() {
        if ("localhost" == window.location.hostname) autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return this.search?.result?.results || [];
    }

    @computed get roomDetails() {
        return this.search?.request?.roomDetails?.[0] || null;
    }

    setDateRange(values) {
        this.search.request.checkInDate = moment(values.start).utc().startOf("day");
        this.search.request.checkOutDate = moment(values.end).utc().startOf("day");
    }

    setSearchResult(value) {
        this.search.result = value;
    }
    setSearchIsLoaded(value) {
        this.search.loaded = value;
    }
    setNewSearchForm(form, isAdvancedSearch) {
        this.search.form = form;
        if (!form)
            this.search.request = copy(defaultSearchForm);

        if (isAdvancedSearch) {
            this.search.request.ratings = form.ratings;
            this.search.request.propertyTypes = form.propertyTypes;
        }
    }

    setSearchRequestField(field, value) {
        this.search.request[field] = value;
    }

    setRequestRoomDetails(field, plus) {
        var current = this.search.request.roomDetails[0],
            maximumPeoplePerQuery = 9,
            minimum = {
                "adultsNumber": 1,
                "childrenNumber": 0,
                "rooms": 1
            },
            maximum = {
                "adultsNumber":  maximumPeoplePerQuery - current.childrenNumber,
                "childrenNumber": maximumPeoplePerQuery - current.adultsNumber,
                "rooms": 5   // todo: make special case for more rooms
            },

            value = this.search.request.roomDetails[0][field] + plus;

        this.search.request.roomDetails[0][field] = Math.min(Math.max(value, minimum[field]), maximum[field]);
    }

    setRequestDestination(value) {
        this.search.request.location = {
            "coordinates": {
                "latitude": 0,
                "longitude": 0
            },
            "distance": 0,
            "predictionResult": {
                "id": value.id,
                "sessionId": session.google.current(),
                "source": value.source,
                "type": value.type
            }
        }
    }

    select(agreement, hotel) {
        this.selected.hotel = hotel;
        this.selected.variant = agreement;
    }

    setBookingRequest(request) {
        this.booking.request = request;
    }

    setBookingResult(result) {
        this.booking.result = result;
    }
}

export default new AccommodationStore();
