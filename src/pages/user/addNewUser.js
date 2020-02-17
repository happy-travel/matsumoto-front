import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import Breadcrumbs from "components/breadcrumbs";
import {FieldCheckbox, FieldSelect, FieldSwitch, FieldText} from "../../components/form";
import {Formik} from "formik";

@observer
export default class AddNewUser extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { t } = useTranslation();

        return <section className="add-new-user">
            <div className="add-new-user__header">
                <Breadcrumbs noBackButton items={[
                    {
                        text: t("Users Management")
                    }, {
                        text: t("Add New User")
                    }
                ]}/>

                <button>{`< Back`}</button>
            </div>

            <h2>{t("USER TYPE")}</h2>

            <div>
                <Formik
                    render={formik => (
                        <div className="form">
                            <div className="row">
                                <div className="add-new-user__input">
                                    <FieldSelect
                                        formik={formik}
                                        id="typeUser"
                                        label={t("Type of user you would like to add")}
                                        options={[
                                            {value: "Unknown",    text: t("All")},
                                            {value: "Unknown2",    text: t("Internal User")},
                                        ]}
                                    />
                                </div>
                                <div className="flex al-center add-new-user__active-block__wrapper">
                                    <div className="add-new-user__active-block">{t("Active")}</div>
                                    <FieldSwitch
                                        formik={formik}
                                        label={t("Active")}
                                    />
                                </div>
                            </div>
                            <div className="flex fd-c add-new-user__type-user-tips">
                                <p className="add-new-user__tips-text"><span className="icon icon-check"/>{t("An Internal user is someone who works in your company.")}</p>
                                <p className="add-new-user__tips-text"><span className="icon icon-check"/>{t("Please note that your company will be responsible for all payments and bookings made by all users linked to your account.")}</p>
                            </div>
                        </div>
                    )}
                />
            </div>

            <div>
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
                                                 addClass={"add-new-user__field add-new-user__input"}
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="firstName"
                                               label={t("First Name")}
                                               placeholder={t("First Name")}
                                               addClass={"add-new-user__field add-new-user__input"}
                                               required
                                    />
                                    <FieldText formik={formik}
                                               id="lastName"
                                               label={t("Last Name")}
                                               placeholder={t("Last Name")}
                                               addClass={"add-new-user__field add-new-user__input"}
                                               required
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="phone"
                                               label={t("Telephone")}
                                               placeholder={t("Telephone")}
                                               addClass={"add-new-user__field add-new-user__input"}
                                               required
                                    />
                                    <FieldText formik={formik}
                                               id="fax"
                                               label={t("Direct Fax")}
                                               placeholder={t("Telephone")}
                                               addClass={"add-new-user__field add-new-user__input"}
                                               required
                                    />
                                </div>
                                <div className="row">
                                    <FieldText formik={formik}
                                               id="phone"
                                               label={t("Telephone")}
                                               addClass={"add-new-user__field add-new-user__input"}
                                               placeholder={t("Telephone")}
                                               required
                                    />
                                    <FieldText formik={formik}
                                               id="fax"
                                               label={t("Direct Fax")}
                                               addClass={"add-new-user__field add-new-user__input"}
                                               placeholder={t("Telephone")}
                                               required
                                    />
                                </div>

                                <h2>{t('Settings')}</h2>

                                <div className="row add-new-user__select-nationality">
                                    <FieldSelect formik={formik}
                                                 id="title"
                                                 label={<>{t("Default Nationality")}<span className="icon icon-info"/></>}
                                                 required
                                                 placeholder={t("Select One")}
                                                 options={[
                                                     { value: "Mr", text: t("Russia")},
                                                     { value: "Ms", text: t("Ms.")},
                                                     { value: "Miss", text: t("Miss")},
                                                     { value: "Mrs", text: t("Mrs.")}
                                                 ]}
                                                 addClass={"add-new-user__field add-new-user__input field-no-grow"}
                                    />
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("View Rates")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Statement of Account")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("View Rates and Book")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("View & Print Proforma")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("View & Print Vouchers")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Supervisor")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Book restricted rates")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Users Manager")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Show Credit")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Company Profile")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Show Estimated Time of Arrival")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                    <div className="field field-no-grow flex jc-between add-new-user__switch">
                                        <div className="label">
                                            <div>{t("Bookings Manager")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field field-no-grow flex jc-between add-new-user__switch__single">
                                        <div className="label">
                                            <div>{t("Would you like to add mark up to this User?")}</div>
                                        </div>
                                        <FieldSwitch
                                            formik={formik}
                                        />
                                    </div>
                                </div>

                                <div className="row jc-end">
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button transparent-with-border button-controls">
                                                {t("exit, no changes")}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button button-controls">
                                                {t("Create new user")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                />
            </div>
        </section>
    }
}