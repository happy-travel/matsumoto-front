import {observable, action} from "mobx";

class CompanyStore {
    @observable companySettings = {};

    @action.bound
    setCompany(company) {
        this.companySettings = company;
    }
}

export default new CompanyStore();