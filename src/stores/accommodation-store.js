import { computed, makeAutoObservable } from "mobx"
import autosave from "core/misc/autosave";
import { SEARCH_STATUSES } from "enum";
import {
    createFilters,
    applyFilters,
    generateFiltersLine,
    generateSorterLine
} from "tasks/utils/accommodation-filtering";
import { accommodationStoreCacheShorter } from "tasks/utils/accommodation-store-cache-shorter";

const DAY_IN_SECONDS = 24 * 60 * 60 * 1000;

class AccommodationStore {
    search = {
        loading: false,
        request: null,
        numberOfNights: 0,
        id: null,
        createdAt: null,
        taskState: "",
        lastCheckedAt: null,
        result: [],
        page: 0,
        resultCount: 0,
        hasMoreSearchResults: false,
        filters: null,
        roomsTaskState: null,
        roomsLastCheckedAt: null,
        roomsCreatedAt: null
    };
    selected = {
        accommodation: null,
        roomContractSet: null,
        accommodationFullDetails: null,
        accommodationFinal: null,
        availabilityId: null,
        sorter: null,
        filters: null
    };
    booking = {
        request: {},
        result: null
    };

    constructor() {
        makeAutoObservable(this);
        autosave(this, "_accommodation_store_cache", accommodationStoreCacheShorter);
    }

    setNewSearchRequest(request) {
        this.search = {
            request,
            numberOfNights: Math.round(Math.abs(new Date(request.checkOutDate) - new Date(request.checkInDate)) / DAY_IN_SECONDS),
            resultCount: 0,
            result: [],
            taskState: SEARCH_STATUSES.STARTED,
            page: 0,
            createdAt: Number(new Date()),
            lastCheckedAt: null,
            loading: false,
            hasMoreSearchResults: false,
            id: null
        };
        this.selected = {
            roomContractSet: null,
            accommodation: null,
            accommodationFullDetails: null,
            accommodationFinal: null,
            availabilityId: null,
            filters: null,
            sorter: null
        };
    }

    setSearchId(searchId) {
        this.search.id = searchId;
        this.search.taskState = SEARCH_STATUSES.CREATED;
    }

    setSearchResult(results, page = 0) {
        if (results?.length) {
            if (page != 0)
                this.search.result.push(...results);
            else
                this.search.result = results;
        }

        this.search.loading = false;
        this.search.lastCheckedAt = Number(new Date());
        this.search.page = page;

        if (!this.filtersLine)
            this.search.hasMoreSearchResults = this.search.result.length < this.search.resultCount;
        else
            this.search.hasMoreSearchResults = results.length == 10;
        if (!results?.length)
            this.search.hasMoreSearchResults = false;

        this.search.filters = createFilters(this.search.result);

        if (0 == page) {
            this.booking.request = null;
            this.booking.result = {};
        }
    }

    updateSearchResultStatus({ resultCount, taskState }) {
        this.search.taskState = taskState;
        if (resultCount !== undefined)
            this.search.resultCount = resultCount;
    }

    @computed get hotelArray() {
        return applyFilters(this.search.result, this.selected.filters) || [];
    }

    searchChecked() {
        this.search.lastCheckedAt = Number(new Date());
    }

    setSearchIsLoading(value) {
        this.search.loading = value;
    }

    setSearchSelectedFilters(filters) {
        this.selected.filters = filters;
    }

    setSearchSelectedSorter(sorter) {
        this.selected.sorter = sorter;
    }

    @computed get filtersLine() {
        return generateFiltersLine(this.selected.filters);
    }

    @computed get sorterLine() {
        return generateSorterLine(this.selected.sorter);
    }

    setSelectedAccommodationFullDetails(details) {
        this.selected.accommodationFullDetails = details;
    }

    selectSearchResultAccommodation(id, roomContractSets) {
        if (undefined === roomContractSets) {
            this.search.roomsTaskState = SEARCH_STATUSES.CREATED;
            this.search.roomsCreatedAt = Number(new Date());
            this.search.roomsLastCheckedAt = null;
            this.selected.accommodationFullDetails = null;
        }

        roomContractSets?.sort((a,b) => a.rate.finalPrice - b.rate.finalPrice);
        this.selected.accommodation = {
            id,
            roomContractSets: roomContractSets || []
        };
    }

    selectRoomContractSet(result, preloaded) {
        if (result.roomContractSet?.rate.currency != preloaded.rate?.currency ||
            result.roomContractSet?.rate.finalPrice !== preloaded.rate?.finalPrice)
            result.roomContractSet.priceChangedAlert = true;

        if (result.roomContractSet?.deadline.date != preloaded.deadline?.date)
            result.roomContractSet.deadlineChangedAlert = true;

        result.roomContractSet.availablePaymentMethods = result.availablePaymentMethods;

        this.selected = {
            ...this.selected,
            accommodationFinal: result,
            roomContractSet: result.roomContractSet,
            availabilityId: result?.availabilityId
        };
        this.booking = {
            request: {},
            result: null
        };
    }

    setRoomsTaskState(value) {
        this.search.roomsTaskState = value;
        this.search.roomsLastCheckedAt = Number(new Date());
    }

    setBookingRequest(request) {
        this.booking.request = request;
    }
}

export default new AccommodationStore();
