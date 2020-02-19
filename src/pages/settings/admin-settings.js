import React from "react";
import {observer} from "mobx-react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";

import { FieldText, FieldSelect, FieldSwitch, FieldCheckbox } from "components/form";
import Flag from "components/flag";
import RegionDropdown, { regionInputChanged } from "components/form/dropdown/region";
import UsersPagesHeader from "components/usersPagesHeader";

@observer
class AdminSettings extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        const { t } = useTranslation();

        const store = {};

        return (<div className="personal-info__wrapper">
            <UsersPagesHeader />

            <section>
                <h2>{t('Personal information')}</h2>

                <Formik
                    render={formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form">
                                <div className="row">
                                    <FieldSelect formik={formik}
                                                 id="title"
                                                 label={t("Salutation")}
                                                 required
                                                 placeholder={t("Select One")}
                                                 options={[
                                                     { value: "Mr", text: t("Mr.")},
                                                     { value: "Ms", text: t("Ms.")},
                                                     { value: "Miss", text: t("Miss")},
                                                     { value: "Mrs", text: t("Mrs.")}
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                    <FieldText formik={formik}
                                               id="position"
                                               label={t("Position/Designation")}
                                               placeholder={t("Position/Designation")}
                                               addClass={"personal-info__field"}
                                               required
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="firstName"
                                               label={t("First Name")}
                                               placeholder={t("First Name")}
                                               addClass={"personal-info__field"}
                                               required
                                    />
                                    <FieldText formik={formik}
                                               id="lastName"
                                               label={t("Last Name")}
                                               placeholder={t("Last Name")}
                                               addClass={"personal-info__field"}
                                               required
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="phone"
                                               label={t("Telephone")}
                                               placeholder={t("Telephone")}
                                               addClass={"personal-info__field"}
                                               required
                                    />
                                    <FieldText formik={formik}
                                               id="fax"
                                               label={t("Direct Fax")}
                                               placeholder={t("Telephone")}
                                               addClass={"personal-info__field"}
                                               required
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="phone"
                                               label={t("Telephone")}
                                               addClass={"personal-info__field"}
                                               placeholder={t("Telephone")}
                                               required
                                    />
                                    <FieldText formik={formik}
                                               id="fax"
                                               label={t("Direct Fax")}
                                               addClass={"personal-info__field"}
                                               placeholder={t("Telephone")}
                                               required
                                    />
                                </div>
                                <div className="row jc-end">
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button transparent-with-border button-controls">
                                                {t("Cancel")}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button button-controls">
                                                {t("save changes")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                />

                <h2>{t('System Settings')}</h2>

                <Formik
                    render={formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form personal-info__form">
                                <div className="row">
                                    <FieldSelect formik={formik}
                                                 id="preferredLanguage"
                                                 label={t("Preferred language")}
                                                 placeholder={t("Preferred language")}
                                                 options={[
                                                     { value: "English", text: "English"},
                                                     { value: "ar", text: "اللغة الحالية"}
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                    <FieldSelect formik={formik}
                                                 id="weekStartOn"
                                                 label={t("Week start on")}
                                                 placeholder={t("Week start on")}
                                                 options={[
                                                     { value: "sn", text: "Sunday"},
                                                     { value: "md", text: "Monday"},
                                                     { value: "tu", text: "Tuesday"},
                                                     { value: "wed", text: "Wednesday"},
                                                     { value: "th", text: "Thursday"},
                                                     { value: "fr", text: "Friday"},
                                                     { value: "st", text: "Saturday"},
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                </div>
                                <div className="row">
                                    <FieldSelect formik={formik}
                                                 id="thousandsSeparator"
                                                 label={t("Thousands Separator")}
                                                 placeholder={t("Thousands Separator")}
                                                 options={[
                                                     { value: "Comma", text: "Comma"},
                                                     { value: "dt", text: "Dot"}
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                    <FieldSelect formik={formik}
                                                 id="decimalSeparator"
                                                 label={t("Decimal Separator")}
                                                 placeholder={t("Decimal Separator")}
                                                 options={[
                                                     { value: "Comma", text: "Comma"},
                                                     { value: "dt", text: "Dot"}
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                </div>
                                <div className="row">
                                    <FieldSelect formik={formik}
                                                 id="decimalsNumber"
                                                 label={t("Decimals Number")}
                                                 placeholder={t("Decimals Number")}
                                                 options={[
                                                     { value: "2", text: "2"},
                                                     { value: "1", text: "1"},
                                                     { value: "0", text: "0"},
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                    <FieldSelect formik={formik}
                                                 id="displayCurrency"
                                                 label={t("Display Currency")}
                                                 placeholder={t("Display Currency")}
                                                 options={[
                                                     { value: "usd", text: "USD - US Dollars"},
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                </div>
                                <div className="row">
                                    <div className="personal-info__form__hor-label">{t("Show Available Credit")}</div>
                                    <FieldSwitch formik={formik}
                                                 id={"available-credit"}
                                    />
                                </div>
                                <div className="row">
                                    <div className="personal-info__form__hor-label">{t("Show Estimated Time of Arrival")}</div>
                                    <FieldSwitch formik={formik}
                                                 id={"esst"}
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="nationality"
                                               additionalFieldForValidation="nationalitySelected"
                                               label={t("Nationality")}
                                               placeholder={t("Choose your nationality")}
                                               clearable
                                               // Flag={<Flag code={store.search.request.nationality} />}
                                               Dropdown={RegionDropdown}
                                               onChange={regionInputChanged}
                                               // options={UI.countries}
                                               // setValue={this.setCountryValue}
                                               addClass={"personal-info__field"}
                                               // onClear={() => store.setSearchRequestField("nationality", '')}
                                    />
                                    <FieldSelect formik={formik}
                                                 id="preferredDateFormat"
                                                 label={t("Preferred Date Format")}
                                                 placeholder={t("Preferred Date Format")}
                                                 options={[
                                                     { value: "2", text: "dd/mm/yyyy"},
                                                     { value: "1", text: "1"},
                                                     { value: "0", text: "0"},
                                                 ]}
                                                 addClass={"personal-info__field"}
                                    />
                                </div>
                                <div className="flex fd-c">
                                    <div>{t('Please choose whether the starting price displayed is per night or whole stay')}:</div><br />
                                    <div className="row personal-info__form__checkbox">
                                        <FieldCheckbox formik={formik}
                                                       id={"perNight"}
                                                       label={"Per Night"}
                                        />
                                        <FieldCheckbox formik={formik}
                                                       id={"wholeStay"}
                                                       label={"Whole Stay"}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <a href="#" className="personal-info__form__link">Generate login link</a>
                                </div>
                                <div className="row jc-end">
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button transparent-with-border button-controls">
                                                {t("Cancel")}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button button-controls">
                                                {t("save changes")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                />
            </section>
        </div>)
    }
}

export default AdminSettings;