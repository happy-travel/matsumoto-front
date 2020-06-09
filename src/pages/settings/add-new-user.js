import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import { withRouter } from "react-router";
import { API } from "core";

import { Loader } from "simple";
import { PERMISSIONS_LABELS } from "core/enums";
import Breadcrumbs from "components/breadcrumbs";
import { FieldSwitch } from "components/form";
import UsersPagesHeader from "parts/users-pages-header";

import View from "stores/view-store";

@withRouter
@observer
export default class AddNewUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inAgencyPermissions: [],
            loadingCounterpartyInfo: true,
            permissionsList: [],
            loadingPermissions: true,

            redirectBack: false,
            loading: false
        };

        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        if (this.props.match?.params) {
            const { agencyId, agentId } = this.props.match.params;

            API.get({
                url: API.AGENCY_AGENT(agencyId, agentId),
                success: result => this.setState({
                    inAgencyPermissions: result.inAgencyPermissions || [],
                    loadingCounterpartyInfo: console.log(result) || false
                })
            });
            API.get({
                url: API.ALL_PERMISSIONS,
                success: result => this.setState({
                    permissionsList: result,
                    loadingPermissions: false
                })
            });
        }
    }

    submit(values) {
        this.setState({ loading: true });

        var { agencyId, agentId } = this.props.match.params,
            url = API.AGENT_PERMISSIONS(agentId, agencyId),
            body = Object.keys(values).map((key) => values[key] ? key : false).filter(item => item);

        if (!body.length)
            body = ["NONE"];

        API.put({
            url,
            body,
            success: () => this.setState({ redirectBack: true }),
            error: () => {
                this.setState({ loading: false });
                View.setTopAlertText("Unable to save user permissions, please try later");
            }
        });
    };

    render() {
        const { t } = useTranslation();
        const {inAgencyPermissions, loadingCounterpartyInfo, loadingPermissions, permissionsList} = this.state;
        if (loadingCounterpartyInfo || loadingPermissions) {
            return <Loader page />;
        }

        if (this.state.redirectBack)
            return <Redirect push to="/settings/users" />;

        return <section className="add-new-user">
            { this.state.loading && <Loader page /> }

            <UsersPagesHeader />
            <div className="add-new-user__header">
                <Breadcrumbs noBackButton items={[
                    {
                        text: t("Users Management")
                    }, {
                        text: t("User permissions")
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
                        ...permissionsList.reduce((obj, key) => ({...obj, [key]: inAgencyPermissions.includes(key)}), {})
                    }}
                    enableReinitialize
                >
                    {formik => (
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

                                <h2 className="users-pages__title" style={{ marginTop: "40px" }}>{t('Settings')}</h2>

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
                                    {permissionsList.map((key) => {
                                        return <div className="field field-no-grow flex jc-between add-new-user__switch">
                                            <div className="label">
                                                <div>{t(PERMISSIONS_LABELS[key])}</div>
                                            </div>
                                            <FieldSwitch
                                                formik={formik}
                                                id={key}
                                            />
                                        </div>
                                    })}
                                </div>

                                <div className="row jc-end">
                                    <div className="field field-no-grow">
                                        <div className="label"/>
                                        <div className="inner">
                                            <button type="submit" className="button transparent-with-border button-controls" onClick={() => this.setState({ redirectBack: true })}>
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
                </Formik>
            </div>
        </section>
    }
}
