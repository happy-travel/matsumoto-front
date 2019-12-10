import React from "react";
import { observable, computed } from "mobx";
import moment from "moment";
import { session } from "core";
import autosave from "core/misc/autosave";
import { createFilters, applyFilters } from "./utils/accommodation-filtering";

const copy = obj => JSON.parse(JSON.stringify(obj));

export const defaultChildrenAge = 12;
const defaultSearchForm = {
        "filters": "Default",
        "checkInDate": moment().utc().startOf("day"),
        "checkOutDate": moment().utc().startOf("day").add(3, "d"),
        "roomDetails": [
            {
                "adultsNumber": 1,
                "childrenNumber": 0
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
        rooms: 1,
        loaded: false,
        form: null,
        result: null
    };

    @observable
    selected = {
        variant: null,
        accommodation: null,
        confirmation: null,
        availabilityId: null
    };

    @observable
    booking = {
        request: {},
        result: null,
        selected: {}
    };

    @observable
    filters = null;

    @observable
    selectedFilters = null;

    @observable
    userBookingList = null;

    @observable
    paymentResult = {};

    constructor() {
        if ("localhost" == window.location.hostname) autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return applyFilters(this.search?.result?.results, this.selectedFilters) || [];
    }

    getRoomDetails(roomNumber) {
        return this.search?.request?.roomDetails?.[roomNumber] || null;
    }

    setDateRange(values) {
        this.search.request.checkInDate = moment(values.start).utc().startOf("day");
        this.search.request.checkOutDate = moment(values.end).utc().startOf("day");
    }

    setSearchResult(value) {
        this.search.result = value;
        this.filters = createFilters(value);
        this.selectedFilters = null;
        this.booking.request = null;
        this.booking.result = {};
        this.paymentResult = {};
    }
    setSelectedFilters(filters) {
        this.selectedFilters = filters;
    }
    setSearchIsLoaded(value) {
        this.search.loaded = value;
    }
    setNewSearchForm(form, isAdvancedSearch) {
        this.search.form = form;
        this.filters = null;
        if (!form)
            this.search.request = copy(defaultSearchForm);

        if (isAdvancedSearch) {
            this.search.request.ratings = form.ratings;
            this.search.request.propertyTypes = form.propertyTypes;
            if (form.radius)
                this.search.request.location.distance = parseInt(form.radius) *1000;
        }
    }

    setSearchRequestField(field, value) {
        this.search.request[field] = value;
    }

    setRequestRoomDetails(roomNumber, field, plus, test) {
        var current = {
                ...this.search.request.roomDetails[roomNumber],
                rooms: this.search.rooms
            },
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
            value = current[field] + plus,
            finalNewValue = Math.min(Math.max(value, minimum[field]), maximum[field]);

        if (test)
            return (finalNewValue != current[field]);

        if (!plus)
            return false;

        if ("rooms" == field) {
            this.search.rooms = finalNewValue;
            if (this.search.request.roomDetails.length < finalNewValue)
                this.search.request.roomDetails.push({
                    "adultsNumber": 1,
                    "childrenNumber": 0
                });
            if (this.search.request.roomDetails.length > finalNewValue)
                this.search.request.roomDetails.pop();
        } else
            this.search.request.roomDetails[roomNumber][field] = finalNewValue;

        if ("childrenNumber" == field) {
            if (!this.search.request.roomDetails[roomNumber].childrenAges)
                this.search.request.roomDetails[roomNumber].childrenAges = new Array(finalNewValue).fill(defaultChildrenAge);
            else
                this.search.request.roomDetails[roomNumber].childrenAges = this.search.request.roomDetails[roomNumber].childrenAges.slice(0, finalNewValue);
        }
    }

    setRequestRoomChildrenAges(roomNumber, value) {
        this.search.request.roomDetails[roomNumber].childrenAges = value.map( val => (parseInt(val) || defaultChildrenAge) );
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

    setUserBookingList(value) {
        this.userBookingList = value;
    }

    selectAccommodation(accommodation) {
        this.selected.accommodation = accommodation;
    }

    selectAgreement(agreement, confirmation) {
        this.selected.variant = agreement;
        this.selected.confirmation = confirmation;
        this.booking.request = null;
        this.booking.result = null;
        this.selected.availabilityId = confirmation?.deadlineDetails?.availabilityId || this.search.result.availabilityId;
    }

    setBookingRequest(request) {
        this.booking.request = request;
    }

    setBookingResult(result, data) {
        this.booking.result =
            ( null !== result && data?.status != 200 )
                ? { error: data?.detail }
                : result;
    }

    setPaymentResult(result) {
        this.paymentResult = result;
        this.paymentResult.params_error = (result.params?.response_message != "Success");
    }

}

export default new AccommodationStore();
