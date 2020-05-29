import React from "react";
import { observable, computed } from "mobx";
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
        result: null,
        length: 0, status: "",
        requestId: null
    };

    @observable
    selected = {
        roomContractSet: null,
        accommodation: null,
        accommodationFinal: null,
        deadlineDetails: null,
        availabilityId: null
    };

    @observable
    booking = {
        request: {},
        result: null,
        referenceCode: null,
        selected: {}
    };

    @observable
    filters = null;

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

    @observable
    hasMoreVariants = false;

    constructor() {
        autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return applyFilters(this.search?.result?.results, this.selectedFilters) || [];
    }

    setSearchResult(value, nonZeroPage) {
        if (value?.results) {
            for (var i = 0; i < value.results.length; i++) {
                var source = value.results[i].source;
                value.results[i] = value.results[i].data;
                value.results[i].source = source;
            }
            if (value.results?.length) {
                value.results.forEach(item => {
                    item.fromPrice = Math.min(...item.roomContractSets.map(x => x.price.netTotal));
                });
            }
            if (nonZeroPage)
                this.search.result.results.push(...value.results);
            else
                this.search.result = value;
        } else {
            this.search.length = 0;
            this.search.result = [];
        }

        this.hasMoreVariants = !!value?.results?.length;
        if (this.search.status == "PartiallyCompleted")
            this.hasMoreVariants = "true"; // temporary

        this.filters = createFilters(this.search.result);

        this.selectedFilters = null;
        this.booking.request = null;
        this.booking.result = {};
        this.paymentResult = {};
    }

    setSearchResultLength(length, status) {
        this.search.length = length;
        this.search.status = status;
    }

    setSearchRequestId(requestId) {
        this.search.requestId = requestId;
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

    setUserBookingList(value) {
        this.userBookingList = value;
    }

    setUserPaymentsList(value) {
        this.userPaymentsList = value;
    }

    selectAccommodation(accommodation) {
        this.selected.accommodation = {
            ...accommodation.data,
            source: accommodation.source
        };
    }

    selectRoomContractSet(result) {
        result = result?.data || null;
        this.selected = {
            ...this.selected,
            accommodationFinal : result,
            roomContractSet : result?.roomContractSet,
            availabilityId : result?.availabilityId,
            deadlineDetails : result?.deadlineDetails
        };
        this.booking.request = null;
        this.booking.result = null;
    }

    setBookingRequest(request) {
        this.booking.request = request;
    }

    setBookingReferenceCode(result) {
        this.booking.referenceCode = result || null;
    }

    setBookingResult(result, data) {
        this.booking.result =
            ( null !== result && data?.status != 200 )
                ? { error: data?.detail }
                : result;
    }

    setPaymentResult(result) {
        this.paymentResult = result;
        if (this.paymentResult.result == "Failed")
            this.paymentResult.error = true;
        this.paymentResult.params_error = (result.params?.response_message != "Success");
    }

    setPaymentMethod(value) {
        this.paymentMethod = value;
    }

}

export default new AccommodationStore();
