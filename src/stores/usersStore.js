// import React from 'react';
import {observable, action} from "mobx";

import data from './mocks';

class UsersStore {
    @observable usersCompany = [];
    @observable usersCompanyCount = data.length; // todo: change to fetched data
    @observable usersCompanyIsLoading = false;
    @observable usersTablePageInfo = {
        pageIndex: 0,
        pageSize: 10,
    };

    @action.bound
    getUsersCompany(params) {
        if (params) {
            this.usersTablePageInfo = {...this.usersTablePageInfo, ...params};
        }
        this.usersCompany = [...data].splice(this.usersTablePageInfo.pageIndex * this.usersTablePageInfo.pageSize, this.usersTablePageInfo.pageSize);
        // this.usersCompany = data;
    }

    @action.bound
    setCompanyUsers(result) {
        this.usersCompany = result;
    }
}

export default new UsersStore();