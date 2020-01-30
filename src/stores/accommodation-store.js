import React from "react";
import { observable, computed } from "mobx";
import { session } from "core";
import autosave from "core/misc/autosave";
import { createFilters, applyFilters } from "./utils/accommodation-filtering";

export const PAYMENT_METHODS = {
    CARD: "CreditCard",
    ACCOUNT: "BankTransfer"
};

class AccommodationStore {
    @observable
    search = {
        destination: "",
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

    setSearchResult(value) {
        this.search.result = value;

        if (this.search.result?.results?.length) {
            this.search.result.results.forEach(item => {
                item.fromPrice = Math.min(...item.agreements.map(x => x.price.netTotal));
            });
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

    setNewSearchDestination(destination) {
        this.search.destination = destination;
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
    }

    selectAgreement(result) {
        this.selected = {
            accommodation : result,
            agreement : result?.agreement,
            availabilityId : result?.availabilityId,
            deadlineDetails : result?.deadlineDetails
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
