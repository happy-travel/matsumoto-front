// import React from 'react';
import {observable, action} from "mobx";

class UsersStore {
    @observable usersCompanyBackup = [];
    @observable usersCompany = [];
    @observable usersCompanyCount = 0;
    @observable usersCompanyIsLoading = true;
    @observable usersTablePageInfo = {
        pageIndex: 0,
        pageSize: 10,
    };

    @action.bound
    setCompanyUsers(result) {
        this.usersCompany = result;
        this.usersCompanyBackup = result;
        this.usersCompanyIsLoading = false;
    }

    @action.bound
    filterCompanyUsers(value) {
        if (value?.length > 0) {
            this.usersCompany = this.usersCompanyBackup.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
        } else {
            this.usersCompany = this.usersCompanyBackup;
        }
    }
}

export default new UsersStore();
