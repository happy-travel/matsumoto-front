import React from "react";
import { observable, computed } from "mobx";
import moment from "moment";
import { session } from "core";
import autosave from "core/misc/autosave";

class AccommodationStore {
    @observable
    search = {
        request: {
            "filters": "Default",
            // todo: "ratings": "TwoStars,ThreeStars,FourStars,FiveStars",
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
            "residency": "" //todo: set default nationality and residency
        },
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
        result: null
    };

    constructor() {
    //    autosave(this, "_accommodation_store_cache");
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
    setSearchForm(value) {
        this.search.form = value;
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

    setBookingResult(result) {
        this.booking.result = result;
    }
}

export default new AccommodationStore();
