import { API, getLocale, setLocale } from "core";
import { $personal } from "stores";

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
        url: API.COUNTERPARTY_INFO,
        success: information => {
            $personal.setCounterpartyInfo(information);
            callback(information);
        }
    });
};

export const fillEmptyAgentSettings = () => {
    loadCounterpartyInfo(information => {
        if (!information?.countryName || !information?.countryCode)
            return;
        saveAgentSettings({
            residency: information.countryName,
            residencyCode: information.countryCode,
            nationality: information.countryName,
            nationalityCode: information.countryCode
        });
    });
};

export const loadAgentSettings = () => {
    API.get({
        url: API.AGENT_SETTINGS,
        success: (result) => {
            $personal.setSettings(result);
            if (!Object.keys(result || {}).length)
                fillEmptyAgentSettings();
            if ("ar" == result.preferredLanguage && !getLocale())
                setLocale("ar");
        }
    });
};

export const saveAgentSettings = (values, after) => {
    API.put({
        url: API.AGENT_SETTINGS,
        body: settingsCleaner(values),
        success: () => {
            $personal.setSettings(values);
            if ("ar" == values.preferredLanguage && "ar" != getLocale())
                setLocale("ar");
        },
        after
    });
};
