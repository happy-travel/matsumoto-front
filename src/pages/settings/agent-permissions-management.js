import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import { API } from "core";

import { Loader } from "simple";
import Breadcrumbs from "components/breadcrumbs";
import { FieldSwitch } from "components/form";
import SettingsHeader from "./parts/settings-header";

import View from "stores/view-store";

const generateLabel = str => {
    if (!str)
        return "Unknown";
    var split = str.split(/([A-Z])/);
    for (var i = 0; i < split.length; i++)
        if (split[i].length > 1)
            split[i]+= " ";
    return split.join("");
};

@observer
export default class AgentPermissionsManagement extends React.Component {
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
                    loadingCounterpartyInfo: false
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
                View.setTopAlertText("Unable to save agent permissions, please try later");
            }
        });
    };

    render() {
        const { t } = useTranslation();

        const {
            inAgencyPermissions, loadingCounterpartyInfo, loadingPermissions, permissionsList
        } = this.state;

        if (loadingCounterpartyInfo || loadingPermissions)
            return <Loader page />;

        if (this.state.redirectBack)
            return <Redirect push to="/settings/agents" />;

        return (
        <div class="settings block">
            { this.state.loading && <Loader page /> }

            <SettingsHeader />

            <section>
                <Breadcrumbs items={[
                    {
                        text: t("Agent Management"),
                        link: "/settings/agents"
                    }, {
                        text: t("Agent Permissions")
                    }
                ]}/>
                <h2><span class="brand">{t("Agent permissions")}</span></h2>

                <div>
                    <Formik
                        onSubmit={this.submit}
                        initialValues={{
                            ...permissionsList.reduce((obj, key) => (
                                {...obj, [key]: inAgencyPermissions.includes(key)}),
                            {})
                        }}
                        enableReinitialize
                    >
                        {formik => (
                            <form onSubmit={formik.handleSubmit}>
                                <div class="form">
                                    <div class="permissions">
                                        {permissionsList.map(key => (
                                            <div class="row">
                                                <FieldSwitch formik={formik}
                                                             id={key}
                                                             label={generateLabel(key)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div class="row controls">
                                        <div class="field">
                                            <div class="label"/>
                                            <div class="inner">
                                                {formik.dirty &&
                                                <button type="submit" class="button transparent-with-border"
                                                        onClick={() => this.setState({ redirectBack: true })}>
                                                    {t("Exit, no changes")}
                                                </button>}
                                            </div>
                                        </div>
                                        <div class="field">
                                            <div class="label"/>
                                            <div class="inner">
                                                <button type="submit" class={"button button-controls" +
                                                __class(!formik.dirty, "disabled")}>
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
        </div>
        );
    }
}
