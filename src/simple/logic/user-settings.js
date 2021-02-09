import { API } from "core";
import { windowLocalStorage } from "core/misc/window-storage";
import { switchLocale } from "core/misc/switch-locale";
import authStore from "stores/auth-store";

const settingsCleaner = values => ({
    nationality: values.nationality,
    residency: values.residency,
    nationalityCode: values.nationalityCode,
    residencyCode: values.residencyCode,
    weekStarts: values.weekStarts,
    preferredLanguage: values.preferredLanguage,
    availableCredit: values.availableCredit,
    newPredictions: values.newPredictions
});

export const loadCounterpartyInfo = (callback = () => {}) => {
    API.get({
        url: API.COUNTERPARTY_INFO,
        success: information => {
            authStore.setCounterpartyInfo(information);
            callback(information);
        }
    });
};

export const fillEmptyUserSettings = () => {
    loadCounterpartyInfo(information => {
        if (!information?.countryName || !information?.countryCode)
            return;
        saveUserSettings({
            residency: information.countryName,
            residencyCode: information.countryCode,
            nationality: information.countryName,
            nationalityCode: information.countryCode
        });
    });
};

export const loadUserSettings = () => {
    API.get({
        url: API.AGENT_SETTINGS,
        success: (result) => {
            authStore.setSettings(result);
            if (!Object.keys(result || {}).length)
                fillEmptyUserSettings();
            if ("ar" == result.preferredLanguage && "ar" != windowLocalStorage.get("locale"))
                switchLocale("ar");
        }
    });
};

export const saveUserSettings = (values, after) => {
    API.put({
        url: API.AGENT_SETTINGS,
        body: settingsCleaner(values),
        success: () => {
            authStore.setSettings(values);
        },
        error: (error) => console.log(error),
        after
    });
};
