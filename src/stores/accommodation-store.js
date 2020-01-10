import React from "react";
import { observable, computed } from "mobx";
import moment from "moment";
import { session } from "core";
import autosave from "core/misc/autosave";
import { createFilters, applyFilters } from "./utils/accommodation-filtering";

export const PAYMENT_METHODS = {
    CARD: "CreditCard",
    ACCOUNT: "BankTransfer"
};

const copy = obj => JSON.parse(JSON.stringify(obj));

export const defaultChildrenAge = 12;
const defaultSearchForm = {
        "filters": "Default",
        "checkInDate": moment().utc().startOf("day"),
        "checkOutDate": moment().utc().startOf("day").add(1, "d"),
        "roomDetails": [
            {
                "adultsNumber": 2,
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

const maximumPeoplePerQuery = 9;
const maximumRoomsPerQuery = 5;
const minimumValuesForSearch = {
    "adultsNumber": 1,
    "childrenNumber": 0,
    "rooms": 1
};
const defaultSearchRooms = 1;

class AccommodationStore {
    @observable
    search = {
        request: copy(defaultSearchForm),
        rooms: defaultSearchRooms,
        loading: false,
        form: null,
        result: null
    };

    @observable
    selected = {
        agreement: null,
        accommodation: null,
        deadlineDetails: null,
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
    isValidFilterQuery = false;

    @observable
    selectedFilters = null;

    @observable
    userBookingList = null;

    @observable
    userPaymentsList = null;

    @observable
    paymentResult = {};

    @observable
    paymentMethod = PAYMENT_METHODS.CARD;

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

        if (this.search.result?.results?.length) {
            this.search.result.results.forEach(item => {
                item.fromPrice = Math.min(...item.agreements.map(x => x.price.netTotal));
            });

            if ("Deadline passed variants temporary hidden") {
                this.search.result.results.forEach(item => {
                    if (item.agreements?.length)
                        item.agreements = item.agreements.filter(item => moment().isBefore(item.deadlineDate));
                });
                this.search.result.results = this.search.result.results.filter(item => item.agreements?.length);
            }
        }

        this.filters = createFilters(this.search.result);
        this.selectedFilters = null;
        this.booking.request = null;
        this.booking.result = {};
        this.paymentResult = {};
    }
    setSelectedFilters(filters) {
        this.selectedFilters = filters;
    }
    setSearchIsLoading(value) {
        this.search.loading = value;
    }
    setNewSearchForm(form, isAdvancedSearch) {
        this.search.form = form;
        this.filters = null;
        if (!form) {
            this.search.request = copy(defaultSearchForm);
            this.search.rooms = defaultSearchRooms;
        }

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
        const current = {
            ...this.search.request.roomDetails[roomNumber],
            rooms: this.search.rooms
        };
        const value = current[field] + plus;
        const finalNewValue = Math.max(value, minimumValuesForSearch[field]);

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

    validateFilterQuery() {
        const countPeoples = this.search.request?.roomDetails?.reduce((acc, currentValue) => acc + currentValue.adultsNumber + currentValue.childrenNumber, 0);
        return this.search.request?.roomDetails?.length <= maximumRoomsPerQuery
            && countPeoples <= maximumPeoplePerQuery;
    }

    setIsInvalidFilterQuery(isValidFilterQuery) {
        this.isValidFilterQuery = isValidFilterQuery;
    }

    setUserBookingList(value) {
        this.userBookingList = value;
    }

    setUserPaymentsList(value) {
        this.userPaymentsList = value;
    }

    selectAccommodation(accommodation) {
        this.selected.accommodation = accommodation;

        if ("Deadline passed variants temporary hidden") {
            if (this.selected.accommodation.agreements?.length)
                this.selected.accommodation.agreements = this.selected.accommodation.agreements.filter(item => moment().isBefore(item.deadlineDate));
        }
    }

    selectAgreement(accommodation, deadlineDetails) {
        this.selected = {
            accommodation : accommodation,
            agreement : accommodation.agreements[0],
            availabilityId : accommodation.availabilityId,
            deadlineDetails : deadlineDetails
        };
        this.booking.request = null;
        this.booking.result = null;
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

    setPaymentMethod(value) {
        this.paymentMethod = value;
    }

}

export default new AccommodationStore();
