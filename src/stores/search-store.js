import React from "react";
import { autorun, observable, computed } from "mobx";

var today = new Date(),
    nextDay = new Date(),
    month = day => { var val = day.getMonth() + 1; return val<10 ? '0'+ val : val };
nextDay.setDate(nextDay.getDate() + 3);

class SearchStore {
    @observable result = {};
    @observable request = {
        "checkInDate": "2019-" + month(today) + "-" + today.getDate() + "T00:00:00.000Z",
        "checkOutDate": "2019-" + month(nextDay) + "-" + nextDay.getDate() + "T00:00:00.000Z",
        "roomDetails": [
            {
                "adultsNumber": 1,
                "childrenNumber": 0,
                "rooms": 1
            }
        ]
    };
    @observable loaded = false;

    constructor() {
        autorun(() => console.log(this.result));
    }

    @computed get hotelArray() {
        if (this.result && this.result.results)
            return this.result.results;
        return false;
    }

    setDateRange(values) {
        this.request.checkInDate = values.start;
        this.request.checkOutDate = values.end;
    }

    setResult(value) {
        this.result = value;
    }
    setLoaded(value) {
        this.loaded = value;
    }

    setRequestAdults(plus) {
        var value = this.request.roomDetails[0].adultsNumber + plus;
        this.request.roomDetails[0].adultsNumber = Math.min(Math.max(value, 1), 30);
    }
    setRequestRooms(plus) {
        var value = this.request.roomDetails[0].rooms + plus;
        this.request.roomDetails[0].rooms = Math.min(Math.max(value, 1), 30);
    }
    setRequestChildren(plus) {
        var value = this.request.roomDetails[0].childrenNumber + plus;
        this.request.roomDetails[0].childrenNumber = Math.min(Math.max(value, 0), 30);
    }
}

export const searchStore = new SearchStore();

export default searchStore;