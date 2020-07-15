import { observable, computed } from "mobx"
import autosave from "core/misc/autosave";
import setter from "core/mobx/setter";
import { createFilters, applyFilters, generateFiltersLine } from "./utils/accommodation-filtering";

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
        requestId: null,
        hasMoreVariants: false,
        page: 0,
        numberOfNights: 0
    };

    @observable
    selected = {
        roomContractSet: null,
        accommodation: null,
        accommodationFullDetails: null,
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
    @setter
    selectedFilters = null;

    @observable
    @setter
    userBookingList = null;

    @observable
    @setter
    userPaymentsList = null;

    @observable
    paymentResult = {};

    @observable
    @setter
    paymentMethod = PAYMENT_METHODS.CARD;

    constructor() {
        autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return applyFilters(this.search?.result, this.selectedFilters) || [];
    }

    setSearchResult(results, page = 0) {
        if (results?.length) {
            for (var i = 0; i < results.length; i++) {
                var source = results[i].source;
                results[i] = results[i].data;
                results[i].source = source;
            }
            results.forEach(item => {
                item.fromPrice = Math.min(...item.roomContractSets.map(x => x.price.netTotal));
            });
            if (page != 0)
                this.search.result.push(...results);
            else
                this.search.result = results;
        } else {
            if (0 == page) {
                this.search.length = 0;
                this.search.result = [];
            }
        }

        this.search.page = page;

        this.search.hasMoreVariants = !!results?.length;
        if (this.search.status == "PartiallyCompleted")
            this.search.hasMoreVariants = this.search.result?.results?.length < this.search.length;

        if ((this.search.status != "PartiallyCompleted") || this.search.result?.results?.length || (this.search.loading == "__filter_tmp"))
            this.search.loading = false;

        this.filters = createFilters(this.search.result);

        if (0 == page) {
            this.booking.request = null;
            this.booking.result = {};
            this.paymentResult = {};
        }
    }

    setSearchResultLength(length, status) {
        this.search.length = length;
        this.search.status = status;
    }

    setSearchRequestId(requestId) {
        this.search.requestId = requestId;
    }

    setSearchIsLoading(value) {
        this.search.loading = value;
    }

    setNewSearchRequest(form) {
        this.search.request = form;
        this.search.numberOfNights = Math.round(Math.abs(new Date(form.checkOutDate) - new Date(form.checkInDate))/24/60/60/1000);
    }

    selectAccommodation(accommodation) {
        this.selected.accommodation = {
            ...accommodation.data,
            source: accommodation.source
        };
    }

    setSelectedAccommodationFullDetails(details) {
        this.selected.accommodationFullDetails = details;
    }

    selectRoomContractSet(result, preloaded) {
        result = result?.data || null;

        if (result?.roomContractSet?.price.currency != preloaded?.price?.currency ||
            result?.roomContractSet?.price.netTotal !== preloaded?.price?.netTotal)
            result.roomContractSet.priceChangedAlert = true;

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

    setBookingResult(result, data, err) {
        this.booking.result =
            ( null !== result && data?.status != 200 )
                ? { error: data?.detail || err?.message || true }
                : result;
    }

    setPaymentResult(result) {
        this.paymentResult = result;
        if (this.paymentResult.result == "Failed")
            this.paymentResult.error = true;
        this.paymentResult.params_error = (result.params?.response_message != "Success");
    }

    @computed get filtersLine() {
        return generateFiltersLine(this.selectedFilters);
    }
}

export default new AccommodationStore();
