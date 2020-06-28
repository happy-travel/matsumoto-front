import { observable, action } from "mobx";

class UsersStore {
    @observable usersCounterpartyBackup = [];
    @observable usersCounterparty = [];
    @observable usersCounterpartyCount = 0;
    @observable usersCounterpartyIsLoading = true;
    @observable usersTablePageInfo = {
        pageIndex: 0,
        pageSize: 10,
    };

    @action.bound
    setCounterpartyUsers(result) {
        this.usersCounterparty = result;
        this.usersCounterpartyBackup = result;
        this.usersCounterpartyIsLoading = false;
    }

    @action.bound
    filterCounterpartyUsers(value) {
        if (!value?.length) {
            this.usersCounterparty = this.usersCounterpartyBackup;
            return;
        }
        this.usersCounterparty = this.usersCounterpartyBackup.filter(
            (user) => user.name.toLowerCase().includes(value.toLowerCase()));
    }
}

export default new UsersStore();
