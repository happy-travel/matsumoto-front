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
        loading: false,
        request: null,
        result: null
    };

    @observable
    selected = {
        agreement: null,
        accommodation: null,
        accommodationFinal: null,
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
        autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return applyFilters(this.search?.result?.results, this.selectedFilters) || [];
    }

    setSearchResult(value) {
        if (value?.results)
            for (var i=0; i < value.results.length; i++) {
                var source = value.results[i].source;
                value.results[i] = value.results[i].data;
                value.results[i].source = source;
            }

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

    setNewSearchRequest(form) {
        this.setSearchResult(null);
        this.search.request = form;
    }

    setIsValidFilterQuery(value) {
        this.isValidFilterQuery = value;
    }

    setUserBookingList(value) {
        this.userBookingList = value;
    }

    setUserPaymentsList(value) {
        this.userPaymentsList = value;
    }

    selectAccommodation(accommodation) {
        var source = accommodation.source;
        this.selected.accommodation = accommodation.data;
        this.selected.accommodation.source = source;
    }

    selectAgreement(result) {
        result = result?.data || null;
        this.selected = {
            ...this.selected,
            accommodationFinal : result,
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
