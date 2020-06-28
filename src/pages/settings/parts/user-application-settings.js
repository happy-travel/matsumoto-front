import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Flag, Loader } from "simple";
import { CachedForm, FieldText, FieldSelect, FieldSwitch } from "components/form";
import RegionDropdown, { regionInputChanged } from "components/form/dropdown/region";
import {
    loadUserSettings,
    saveUserSettings
} from "simple/logic/user-settings";

import authStore from "stores/auth-store";
import UI from "stores/ui-store";
import View from "stores/view-store";

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
        this.setState({ loading: true });
        saveUserSettings(
            values,
            () => this.setState({ loading: false })
        );
    }

    setCountryValue(country, formik, connected) {
        View.setCountries([]);
        formik.setFieldValue(connected, country.name);
        formik.setFieldValue(connected+"Code", country.code);
    };

    render() {
        const { t } = useTranslation();
        return (
            <React.Fragment>
                {this.state.loading && <Loader page />}

                <h2><span class="brand">{t("Application Settings")}</span></h2>

                <CachedForm
                    initialValues={authStore.settings}
                    enableReinitialize
                    onSubmit={this.submitUserSettings}
                    render={formik => (
                        <div class="form app-settings">
                            <div class="row">
                                <FieldSelect formik={formik}
                                             id="preferredLanguage"
                                             label={t("Preferred language")}
                                             placeholder={t("Preferred language")}
                                             options={[
                                                 { value: "en", text: "English"},
                                                 { value: "ar", text: "اللغة الحالية"}
                                             ]}
                                />
                                <FieldSelect formik={formik}
                                             id="weekStarts"
                                             label={t("Week starts on")}
                                             placeholder={t("Default")}
                                             options={[
                                                 { value: 0, text: "Default"},
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
                                <div class="vertical-label">
                                    {t("Show Available Credit")}
                                </div>
                                <FieldSwitch formik={formik}
                                             id="availableCredit"
                                />
                            </div>
                            <div class="row">
                                <FieldText formik={formik}
                                           id="nationality"
                                           label={t("Predefined Nationality")}
                                           placeholder={t("Choose nationality")}
                                           clearable
                                           Flag={<Flag code={formik.values.nationalityCode} />}
                                           Dropdown={RegionDropdown}
                                           onChange={regionInputChanged}
                                           options={UI.countries}
                                           setValue={this.setCountryValue}
                                           onClear={() => formik.setFieldValue("nationalityCode", "")}
                                />
                                <FieldText formik={formik}
                                           id="residency"
                                           label={t("Predefined Residency")}
                                           placeholder={t("Choose residency")}
                                           clearable
                                           Flag={<Flag code={formik.values.residencyCode} />}
                                           Dropdown={RegionDropdown}
                                           onChange={regionInputChanged}
                                           options={UI.countries}
                                           setValue={this.setCountryValue}
                                           onClear={() => formik.setFieldValue("residencyCode", "")}
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
