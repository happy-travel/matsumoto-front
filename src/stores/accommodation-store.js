import React from "react";
import { observable, computed } from "mobx";
import moment from "moment";
import { session } from "core";
import autosave from "core/misc/autosave";
import { createFilters, applyFilters } from "./utils/accommodation-filtering";

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
        request: {},
        result: {
            referenceCode: null
        }
    };

    @observable
    filters = null;

    @observable
    selectedFilters = null;

    @observable
    userBookingList = [];

    @observable
    paymentResult = {};

    constructor() {
        if ("localhost" == window.location.hostname) autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return applyFilters(this.search?.result?.results, this.selectedFilters) || [];
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

            value = this.search.request.roomDetails[0][field] + plus,
            finalNewValue = Math.min(Math.max(value, minimum[field]), maximum[field]);

        this.search.request.roomDetails[0][field] = finalNewValue;
        if (field == "childrenNumber")
            this.search.request.roomDetails[0].childrenAges = new Array(finalNewValue).fill(12);
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
        if (!value || !value.forEach)
            value = [];

        value.forEach(item => {
            var bookingDetails = null,
                serviceDetails = null;
            try {
                bookingDetails = JSON.parse(item.bookingDetails);
                serviceDetails = JSON.parse(item.serviceDetails);
            } catch (e) {}

            item.bookingDetails = bookingDetails;
            item.serviceDetails = serviceDetails;
        });

        this.userBookingList = value;
    }

    select(agreement, hotel) {
        this.selected.hotel = hotel;
        this.selected.variant = agreement;
    }

    setBookingRequest(request) {
        this.booking.request = request;
    }

    setBookingResult(result, data) {
        if (data?.status && data.status != 200)
            this.booking.result = {
                error: data.detail,
                loaded: true
            };
        else {
            this.booking.result = {
                ...(result || {}),
                loaded: true
            }
        }
    }

    setPaymentResult(result) {
        this.paymentResult = result;
        this.paymentResult.params_error = (result.params?.response_message != "Success");
    }

}

export default new AccommodationStore();
