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
        "checkInDate": moment().utc().startOf('day'),
        "checkOutDate": moment().utc().startOf('day').add(3, 'd'),
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
        this.request.checkInDate = moment(values.start).utc().startOf('day');
        this.request.checkOutDate = moment(values.end).utc().startOf('day');
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

    setRequestAdults(plus) {
        var value = this.request.roomDetails[0].adultsNumber + plus;
        this.request.roomDetails[0].adultsNumber = Math.min(Math.max(value, 1), 9);
    }
    setRequestRooms(plus) {
        var value = this.request.roomDetails[0].rooms + plus;
        this.request.roomDetails[0].rooms = Math.min(Math.max(value, 1), 5); //todo: make special case for more people
    }
    setRequestChildren(plus) {
        var value = this.request.roomDetails[0].childrenNumber + plus;
        this.request.roomDetails[0].childrenNumber = Math.min(Math.max(value, 0), 8); //todo: total 9 people max
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

const accommodationStore = new AccommodationStore();

export default accommodationStore;