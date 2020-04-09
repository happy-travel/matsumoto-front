import {observable, action} from "mobx";

class CompanyStore {
    @observable companySettings = {};
    @observable isLoadingCompanySettings = true;

    @action.bound
    setCompany(company) {
        this.companySettings = company;
        this.isLoadingCompanySettings = false;
    }
}

export default new CompanyStore();
