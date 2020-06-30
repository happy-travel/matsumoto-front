import { API } from "core";

import authStore from "stores/auth-store";

const settingsCleaner = values => ({
    nationality: values.nationality,
    residency: values.residency,
    nationalityCode: values.nationalityCode,
    residencyCode: values.residencyCode,
    weekStarts: values.weekStarts,
    preferredLanguage: values.preferredLanguage,
    availableCredit: values.availableCredit
});

export const loadCounterpartyInfo = (callback = () => {}) => {
    API.get({
        url: API.COUNTERPARTY_INFO(authStore.activeCounterparty.id),
        success: information => {
            authStore.setCounterpartyInfo(information);
            callback(information);
        }
    });
};

export const fillEmptyUserSettings = () => {
    loadCounterpartyInfo(information => {
        if (!information?.country || !information?.countryCode)
            return;
        saveUserSettings({
            residency: information.country,
            residencyCode: information.countryCode,
            nationality: information.country,
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
