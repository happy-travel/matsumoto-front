import React from "react";
import { observable, computed } from "mobx";
import moment from "moment";
import { session } from "core";
import autosave from "core/misc/autosave";

class AccommodationStore {
    @observable result = {};
    @observable request = {
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
        "nationality": "UK",
        "residency": "UK" //todo: set default nationality and residency
    };
    @observable loaded = false;

    @observable selectedVariant = {};
    @observable selectedHotel = {};

    @observable bookingResult = {};

    constructor() {
        autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        if (this.result && this.result.results)
            return this.result.results;
        return false;
    }

    setDateRange(values) {
        this.request.checkInDate = moment(values.start).utc().startOf("day");
        this.request.checkOutDate = moment(values.end).utc().startOf("day");
    }

    setResult(value) {
        this.result = value;
    }
    setLoaded(value) {
        this.loaded = value;
    }

    setRequestNationality(value) {
        this.request.residency = value;
    }

    setRequestResidency(value) {
        this.request.residency = value;
    }

    setRequestRoomDetails(field, plus) {
        var current = this.request.roomDetails[0],
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

            value = this.request.roomDetails[0][field] + plus;

        this.request.roomDetails[0][field] = Math.min(Math.max(value, minimum[field]), maximum[field]);
    }

    setRequestDestination(value) {
        this.request.location = {
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

    setSelectedHotel(hotel) {
        this.selectedHotel = hotel;
    }

    setSelectedVariant(agreement) {
        this.selectedVariant = agreement;
    }

    setBookingResult(result) {
        this.bookingResult = result;
    }
}

export default new AccommodationStore();
