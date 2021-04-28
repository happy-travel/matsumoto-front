import { makeAutoObservable } from "mobx";
import autosave from "core/misc/autosave";

const ourCompanyInfoDefault = {"name":"HappyTravelDotCom Travel and Tourism LLC","address":"B105, Saraya Avenue building","country":"United Arab Emirates","city":"Dubai","phone":"+971-4-2940007","email":"info@happytravel.com","postalCode":"Box 36690","trn":"100497287100003","iata":"96-0 4653","tradeLicense":"828719"};

class UIStore {
    regions = [];
    currencies = [];
    ourCompanyInfo = ourCompanyInfoDefault;
    formCache = {};
    currentAPIVersion = null;

    constructor() {
        makeAutoObservable(this);
        autosave(this, "_ui_store_cache");
    }

    setRegions(value) {
        if (!value || !Array.isArray(value))
            return [];

        this.regions = value.sort((currentRegion, nextRegion) => {
            if (currentRegion.id === 142 || currentRegion.name === "Asia") {
                return -1;
            }
            if (nextRegion.id === 142 || nextRegion.name === "Asia") {
                return 1;
            }
            return 0;
        });
    }

    getFormCache(formName) {
        if (!formName) return null;
        if (!this.formCache?.[formName])
            return null;
        let result = null;
        try {
            result = JSON.parse(this.formCache[formName]);
        } catch (e) {}
        return result;
    }

    setFormCache(formName, values) {
        if (!formName) return null;
        this.formCache[formName] = values ? JSON.stringify(values) : null;
    }

    dropFormCache(formName) {
        this.setFormCache(formName);
    }

    dropAllFormCaches() {
        this.formCache = {};
    }

    setCurrencies(values) { this.currencies = values || []; }
    setOurCompanyInfo(values) { this.ourCompanyInfo = values; }
    setCurrentAPIVersion(values) { this.currentAPIVersion = values; }
}

export default new UIStore();
