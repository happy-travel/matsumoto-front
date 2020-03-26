import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { withRouter } from "react-router";

import {PERMISSIONS_LABELS, PERMISSIONS} from "core/enums";
import {API} from "core";

import Breadcrumbs from "components/breadcrumbs";
import { FieldCheckbox, FieldSelect, FieldSwitch, FieldText } from "../../components/form";
import UsersPagesHeader from "components/usersPagesHeader";

@withRouter
@observer
export default class AddNewUser extends React.Component {
    constructor() {
        super();

        this.state = {
            inCompanyPermissions: [],
        }
    }

    componentDidMount() {
        if (this.props.match?.params) {
            const {companyId, branchId, customerId} = this.props.match.params;
            const url = branchId ?
                API.COMPANY_BRANCH_CUSTOMERS(companyId, branchId) :
                API.COMPANY_CUSTOMER(companyId, customerId);
            API.get({
                url,
                success: (result) => this.setState({inCompanyPermissions: result.inCompanyPermissions}),
            });
        }
    }

    submit = (values) => {
        const {companyId, branchId, customerId} = this.props.match.params;
        const url = branchId ?
            API.CUSTOMER_BRANCH_PERMISSIONS(companyId, customerId, branchId) :
            API.CUSTOMER_PERMISSIONS(companyId, customerId);
        const body = Object.keys(values).map((key) => values[key] ? key : false).filter(item => item);

        API.put({
            url,
            body,
            success: () => this.props.history.goBack(),
        });
    }

    render() {
        const { t } = useTranslation();
        const {inCompanyPermissions} = this.state;

        return <section className="add-new-user">
            <UsersPagesHeader />
            <div className="add-new-user__header">
                <Breadcrumbs noBackButton items={[
                    {
                        text: t("Users Management")
                    }, {
                        text: t("Add New User")
                    }
                ]}/>

                <button onClick={() => this.props.history.goBack()}>{`< Back`}</button>
            </div>

            {/*<h2>{t("USER TYPE")}</h2>*/}

            {/*<div>*/}
            {/*    <Formik*/}
            {/*        render={formik => (*/}
            {/*            <div className="form">*/}
            {/*                <div className="row">*/}
            {/*                    <div className="add-new-user__input">*/}
            {/*                        <FieldSelect*/}
            {/*                            formik={formik}*/}
            {/*                            id="typeUser"*/}
            {/*                            label={t("Type of user you would like to add")}*/}
            {/*                            options={[*/}
            {/*                                {value: "Unknown",    text: t("All")},*/}
            {/*                                {value: "Unknown2",    text: t("Internal User")},*/}
            {/*                            ]}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="flex al-center add-new-user__active-block__wrapper">*/}
            {/*                        <div className="add-new-user__active-block">{t("Active")}</div>*/}
            {/*                        <FieldSwitch*/}
            {/*                            formik={formik}*/}
            {/*                            label={t("Active")}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="flex fd-c add-new-user__type-user-tips">*/}
            {/*                    <p className="add-new-user__tips-text"><span className="icon icon-check"/>{t("An Internal user is someone who works in your company.")}</p>*/}
            {/*                    <p className="add-new-user__tips-text"><span className="icon icon-check"/>{t("Please note that your company will be responsible for all payments and bookings made by all users linked to your account.")}</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*</div>*/}

            <div>
                {/*<h2>{t('Personal information')}</h2>*/}

                <Formik
                    onSubmit={this.submit}
                    initialValues={{
                        ...Object.keys(PERMISSIONS).reduce((obj, key) => ({...obj, [PERMISSIONS[key]]: inCompanyPermissions.includes(PERMISSIONS[key])}), {})
                    }}
                    render={formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form">
                                {/*<div className="row">*/}
                                {/*    <FieldSelect formik={formik}*/}
                                {/*                 id="title"*/}
                                {/*                 label={t("Salutation")}*/}
                                {/*                 required*/}
                                {/*                 placeholder={t("Select One")}*/}
                                {/*                 options={[*/}
                                {/*                     { value: "Mr", text: t("Mr.")},*/}
                                {/*                     { value: "Ms", text: t("Ms.")},*/}
                                {/*                     { value: "Miss", text: t("Miss")},*/}
                                {/*                     { value: "Mrs", text: t("Mrs.")}*/}
                                {/*                 ]}*/}
                                {/*                 addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*    />*/}
                                {/*</div>*/}
                                {/*<div className="row">*/}
                                {/*    <FieldText formik={formik}*/}
                                {/*               id="firstName"*/}
                                {/*               label={t("First Name")}*/}
                                {/*               placeholder={t("First Name")}*/}
                                {/*               addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*               required*/}
                                {/*    />*/}
                                {/*    <FieldText formik={formik}*/}
                                {/*               id="lastName"*/}
                                {/*               label={t("Last Name")}*/}
                                {/*               placeholder={t("Last Name")}*/}
                                {/*               addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*               required*/}
                                {/*    />*/}
                                {/*</div>*/}
                                {/*<div className="row">*/}
                                {/*    <FieldText formik={formik}*/}
                                {/*               id="phone"*/}
                                {/*               label={t("Telephone")}*/}
                                {/*               placeholder={t("Telephone")}*/}
                                {/*               addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*               required*/}
                                {/*    />*/}
                                {/*    <FieldText formik={formik}*/}
                                {/*               id="fax"*/}
                                {/*               label={t("Direct Fax")}*/}
                                {/*               placeholder={t("Telephone")}*/}
                                {/*               addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*               required*/}
                                {/*    />*/}
                                {/*</div>*/}
                                {/*<div className="row">*/}
                                {/*    <FieldText formik={formik}*/}
                                {/*               id="phone"*/}
                                {/*               label={t("Telephone")}*/}
                                {/*               addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*               placeholder={t("Telephone")}*/}
                                {/*               required*/}
                                {/*    />*/}
                                {/*    <FieldText formik={formik}*/}
                                {/*               id="fax"*/}
                                {/*               label={t("Direct Fax")}*/}
                                {/*               addClass={"add-new-user__field add-new-user__input"}*/}
                                {/*               placeholder={t("Telephone")}*/}
                                {/*               required*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <h2>{t('Settings')}</h2>

                                {/*<div className="row add-new-user__select-nationality">*/}
                                {/*    <FieldSelect formik={formik}*/}
                                {/*                 id="title"*/}
                                {/*                 label={<>{t("Default Nationality")}<span className="icon icon-info"/></>}*/}
                                {/*                 required*/}
                                {/*                 placeholder={t("Select One")}*/}
                                {/*                 options={[*/}
                                {/*                     { value: "Mr", text: t("Russia")},*/}
                                {/*                     { value: "Ms", text: t("Ms.")},*/}
                                {/*                     { value: "Miss", text: t("Miss")},*/}
                                {/*                     { value: "Mrs", text: t("Mrs.")}*/}
                                {/*                 ]}*/}
                                {/*                 addClass={"add-new-user__field add-new-user__input field-no-grow"}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <div className="row wrap">
                                    {Object.keys(PERMISSIONS_LABELS).map((key) => {
                                        return <div className="field field-no-grow flex jc-between add-new-user__switch">
                                            <div className="label">
                                                <div>{t(PERMISSIONS_LABELS[key])}</div>
                                            </div>
                                            <FieldSwitch
                                                formik={formik}
                                                id={PERMISSIONS[key]}
                                            />
                                        </div>
                                    })}
                                </div>

                                <div className="row jc-end">
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button transparent-with-border button-controls" onClick={this.props.history.goBack}>
                                                {t("exit, no changes")}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button button-controls">
                                                {t("Save changes")}
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