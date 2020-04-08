// import React from 'react';
import {observable, action} from "mobx";

class UsersStore {
    @observable usersCompany = [];
    @observable usersCompanyCount = 0;
    @observable usersCompanyIsLoading = false;
    @observable usersTablePageInfo = {
        pageIndex: 0,
        pageSize: 10,
    };

    @action.bound
    setCompanyUsers(result) {
        this.usersCompany = result;
    }
}

export default new UsersStore();