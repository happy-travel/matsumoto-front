import React from "react";
import { autorun, observable, computed } from "mobx";

var today = new Date(),
    nextDay = new Date(),
    leadZero = val => val < 10 ? '0'+ val : val,
    month = day => leadZero(day.getMonth() + 1);
nextDay.setDate(nextDay.getDate() + 3);

class SearchStore {
    @observable result = {};
    @observable request = {
        "checkInDate": "2019-" + month(today) + "-" + leadZero(today.getDate()) + "T00:00:00.000Z",
        "checkOutDate": "2019-" + month(nextDay) + "-" + leadZero(nextDay.getDate()) + "T00:00:00.000Z",
        "roomDetails": [
            {
                "adultsNumber": 1,
                "childrenNumber": 0,
                "rooms": 1
            }
        ],
        "nationality": "RU",
        "cityCodes": []
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

    setRequestNationality(value) {
        this.request.nationality = value;
        this.request.residency = value;
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

    setRequestDestination(value) {
        this.request.cityCodes = [];
        this.request.location = {
            "coordinates": {
                "latitude": 0,
                "longitude": 0
            },
            "distance": 0,
            "predictionResult": {
                "id": value.id,
                "sessionId": window.sessionStorage.getItem('google-session'),
                "source": value.source,
                "type": value.type
            }
        }
    }
}

const searchStore = new SearchStore();

export default searchStore;