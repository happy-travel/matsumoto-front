import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import i18n from 'i18next';

import { Loader, Flag } from "simple";
import {
    CachedForm,
    FieldSelect,
    FieldSwitch,
    FORM_NAMES
} from "components/form";
import FieldCountry from "components/complex/field-country";
import {
    loadUserSettings,
    saveUserSettings
} from "simple/logic";
import { switchLocale } from "core/misc/switch-locale";

import UI from "stores/ui-store";
import authStore from "stores/auth-store";

@observer
class UserApplicationSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };

        loadUserSettings();
        this.submitUserSettings = this.submitUserSettings.bind(this);
    }

    submitUserSettings(values) {
        var shouldDropSearchCache =
            values.nationality != authStore.settings.nationality ||
            values.residency != authStore.settings.residency;

        this.setState({ loading: true });
        saveUserSettings(
            values,
            () => {
                if (values.preferredLanguage != i18n.language)
                    switchLocale(values.preferredLanguage);{
                    if (shouldDropSearchCache)
                        UI.dropFormCache(FORM_NAMES.SearchForm);
                }
                this.setState({ loading: false });
            }
        );
    }

    render() {
        const { t } = useTranslation();
        if (this.state.loading)
            return <Loader page />;

        return (
            <React.Fragment>
                <h2><span class="brand">{t("Application Settings")}</span></h2>

                <CachedForm
                    initialValues={authStore.settings}
                    enableReinitialize
                    onSubmit={this.submitUserSettings}
                    render={formik => (
                        <div class="form app-settings">
                            <div class="row">
                                <FieldSwitch formik={formik}
                                             id="availableCredit"
                                             label={t("Show Available Credit")}
                                />
                            </div>
                            <div class="row">
                                <FieldSelect formik={formik}
                                             id="preferredLanguage"
                                             label={t("Preferred language")}
                                             placeholder={t("Preferred language")}
                                             options={[
                                                 { value: "en", text: "English", flag: "gb"},
                                                 { value: "ar", text: "اللغة الحالية", flag: "ae"}
                                             ]}
                                             Flag={<Flag language={formik.values.preferredLanguage} />}
                                />
                                <FieldSelect formik={formik}
                                             id="weekStarts"
                                             label={t("Week starts on")}
                                             placeholder={t("Automatic")}
                                             options={[
                                                 { value: 0, text: "Automatic"},
                                                 { value: 7, text: "Sunday"},
                                                 { value: 1, text: "Monday"},
                                                 { value: 2, text: "Tuesday"},
                                                 { value: 3, text: "Wednesday"},
                                                 { value: 4, text: "Thursday"},
                                                 { value: 5, text: "Friday"},
                                                 { value: 6, text: "Saturday"},
                                             ]}
                                />
                            </div>
                            <div class="row">
                                <FieldCountry formik={formik}
                                              id="nationality"
                                              anotherField="residency"
                                              label={t("Nationality")}
                                              placeholder={t("Choose your nationality")}
                                              clearable
                                />
                                <FieldCountry formik={formik}
                                              id="residency"
                                              anotherField="nationality"
                                              label={t("Residency")}
                                              placeholder={t("Choose your residency")}
                                              clearable
                                />
                            </div>
                            <div class="row controls">
                                <div class="field">
                                    <div class="inner">
                                        <button type="submit" class={"button" +
                                                                __class(!formik.isValid || !formik.dirty, "disabled")}>
                                            {t("Save changes")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </React.Fragment>
        );
    }
}

export default UserApplicationSettings;
