import {observable, action} from "mobx";

class CounterpartyStore {
    @observable counterpartySettings = {};
    @observable isLoadingCounterpartySettings = true;

    @action.bound
    setCounterparty(counterparty) {
        this.counterpartySettings = counterparty;
        this.isLoadingCounterpartySettings = false;
    }
}

export default new CounterpartyStore();
