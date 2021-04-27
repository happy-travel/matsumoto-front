import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { setLocale } from "core";
import { Loader, Flag } from "components/simple";
import { CachedForm, FieldSelect, FieldSwitch, FORM_NAMES } from "components/form";
import FieldCountry from "components/complex/field-country";
import { loadAgentSettings, saveAgentSettings } from "simple/logic";
import { $ui, $personal } from "stores";

const ApplicationSettings = observer(() => {
    const [loading, setLoading] = useState(false);

    const submitAgentSettings = (values) => {
        const shouldDropSearchCache = (
            values.nationality != $personal.settings.nationality ||
            values.residency != $personal.settings.residency
        );
        setLoading(true);
        saveAgentSettings(
            values,
            () => {
                if (values.preferredLanguage != i18n.language) {
                    setLocale(values.preferredLanguage);
                    if (shouldDropSearchCache)
                        $ui.dropFormCache(FORM_NAMES.SearchForm);
                }
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        loadAgentSettings();
    }, []);

    const { t } = useTranslation();

    if (loading)
        return <Loader page />;

    return (
        <div className="cabinet block">
            <section>
                <h2>{t("Application Settings")}</h2>

                <CachedForm
                    initialValues={$personal.settings}
                    onSubmit={submitAgentSettings}
                    render={formik => (
                        <div className="form app-settings">
                            { $personal.permitted("ObserveBalance") &&
                                <div className="row">
                                    <FieldSwitch
                                        formik={formik}
                                        id="availableCredit"
                                        label={t("Show Available Credit")}
                                    />
                                </div>
                            }
                            <div className="row">
                                <FieldSwitch
                                    formik={formik}
                                    id="experimentalFeatures"
                                    label={t("Enable experimental features (may be unstable)")}
                                />
                            </div>
                            <div className="row double">
                                <FieldSelect
                                    formik={formik}
                                    id="preferredLanguage"
                                    label={t("Preferred language")}
                                    placeholder={t("Preferred language")}
                                    options={[
                                        { value: "en", text: "English", flag: "gb"},
                                        { value: "ar", text: "اللغة الحالية", flag: "ae"}
                                    ]}
                                    Icon={<Flag language={formik.values.preferredLanguage} />}
                                />
                                <FieldSelect
                                    formik={formik}
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
                            <div className="row double">
                                <FieldCountry
                                    formik={formik}
                                    id="nationality"
                                    anotherField="residency"
                                    label={t("Nationality")}
                                    placeholder={t("Choose your nationality")}
                                    clearable
                                />
                                <FieldCountry
                                    formik={formik}
                                    id="residency"
                                    anotherField="nationality"
                                    label={t("Residency")}
                                    placeholder={t("Choose your residency")}
                                    clearable
                                />
                            </div>
                            <div className="row controls">
                                <div className="field">
                                    <div className="inner">
                                        <button
                                            type="submit"
                                            className={"button" + __class(!formik.isValid || !formik.dirty, "disabled")}
                                        >
                                            {t("Save changes")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </section>
        </div>
    );
});

export default ApplicationSettings;
