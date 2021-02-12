import { observable, computed } from "mobx"
import autosave from "core/misc/autosave";
import setter from "core/mobx/setter";
import {
    createFilters,
    applyFilters,
    generateFiltersLine,
    generateSorterLine
} from "tasks/utils/accommodation-filtering";

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
        id: null,
        hasMoreSearchResults: false,
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
    sorter = null;

    @observable
    @setter
    userBookingList = null;

    @observable
    paymentResult = {};

    @observable
    @setter
    paymentMethod = PAYMENT_METHODS.CARD;

    @observable
    @setter
    secondStepState = null;

    @observable
    @setter
    bookingToPay = null; // todo: refactor, it's temporary decision

    constructor() {
        autosave(this, "_accommodation_store_cache");
    }

    @computed get hotelArray() {
        return applyFilters(this.search?.result, this.selectedFilters) || [];
    }

    setSearchResult(results, page = 0) {
        if (results?.length) {
            if (page != 0)
                this.search.result.push(...results);
            else
                this.search.result = results;
        } else if (0 == page)
            this.search.result = [];

        this.search.page = page;

        this.search.hasMoreSearchResults = !!results?.length;
        if (this.search.status == "PartiallyCompleted")
            this.search.hasMoreSearchResults = this.search.result?.results?.length < this.search.length;

        if ((this.search.status != "PartiallyCompleted") || this.search.result?.length || (this.search.loading == "__filter_tmp"))
            this.search.loading = false;

        if (this.search.status == "Completed") 
            this.search.loading = false;

        this.filters = createFilters(this.search.result);

        if (0 == page) {
            this.booking.request = null;
            this.booking.result = {};
        }
    }

    setSearchResultLength(length, status) {
        this.search.length = length;
        this.search.status = status;
    }

    setSearchId(searchId) {
        this.search.id = searchId;
    }

    setSearchIsLoading(value) {
        this.search.loading = value;
    }

    setNewSearchRequest(form) {
        this.search.request = form;
        this.search.numberOfNights = Math.round(Math.abs(new Date(form.checkOutDate) - new Date(form.checkInDate))/24/60/60/1000);
    }

    setRoomContractsSets(id, roomContractSets = []) {
        roomContractSets?.sort((a,b) => a.rate.finalPrice - b.rate.finalPrice);
        this.selected.accommodation = {
            id,
            roomContractSets
        };
    }

    setSelectedAccommodationFullDetails(details) {
        this.selected.accommodationFullDetails = details;
    }

    selectRoomContractSet(result, preloaded) {
        if (result?.roomContractSet?.rate.currency != preloaded?.rate?.currency ||
            result?.roomContractSet?.rate.finalPrice !== preloaded?.rate?.finalPrice)
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
        this.paymentResult = {};
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

    setUpdatedBookingStatus(value) {
        this.booking.result.bookingDetails.status = value;
    }

    setPaymentResult(result) {
        this.paymentResult = result;
        if (!result)
            return;
        if (this.paymentResult.result == "Failed")
            this.paymentResult.error = true;
        if (result.params.response_message)
            this.paymentResult.params_error = (result.params.response_message != "Success");
    }

    @computed get filtersLine() {
        return generateFiltersLine(this.selectedFilters);
    }

    @computed get sorterLine() {
        return generateSorterLine(this.sorter);
    }
}

export default new AccommodationStore();
