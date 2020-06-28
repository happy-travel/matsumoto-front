import { API } from "core";

import authStore from "stores/auth-store";

const settingsCleaner = values => {
    return {
        nationality: values.nationality,
        residency: values.residency,
        nationalityCode: values.nationalityCode,
        residencyCode: values.residencyCode,
        weekStarts: values.weekStarts,
        preferredLanguage: values.preferredLanguage,
        availableCredit: values.availableCredit
    };
};

export const loadUserSettings = () => {
    API.get({
        url: API.AGENT_SETTINGS,
        success: (result) => {
            authStore.setSettings(result);
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
