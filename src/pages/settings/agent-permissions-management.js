import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import { API } from "core";

import { Loader, PassengerName } from "simple";
import Breadcrumbs from "components/breadcrumbs";
import { FieldSwitch } from "components/form";
import SettingsHeader from "./parts/settings-header";

import View from "stores/view-store";
import authStore from "stores/auth-store";

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
            agent: {},
            permissionsList: [],

            redirectBack: false,
            loading: true
        };

        this.submit = this.submit.bind(this);
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
    }

    enable() {
        const { agentId } = this.props.match.params;
        API.post({
            url: API.AGENT_ENABLE(agentId),
            success: () => View.setTopAlertText("Enabled")
        });
    }

    disable() {
        const { agentId } = this.props.match.params;
        API.post({
            url: API.AGENT_DISABLE(agentId),
            success: () => View.setTopAlertText("Disabled")
        });
    }

    componentDidMount() {
        if (this.props.match?.params) {
            const { agencyId, agentId } = this.props.match.params;

            API.get({
                url: API.AGENCY_AGENT(agencyId, agentId),
                success: (agent) => this.setState({
                    agent,
                    loading: false
                })
            });
            API.get({
                url: API.ALL_PERMISSIONS,
                success: permissionsList => this.setState({ permissionsList })
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
        var { t } = useTranslation(),
            { agent, permissionsList, loading } = this.state,
            { inAgencyPermissions } = agent;

        if (this.state.redirectBack)
            return <Redirect push to="/settings/agents" />;

        return (
        <div class="settings block">
            <SettingsHeader />

            { loading ?
                <Loader /> :
            <section>
                <Breadcrumbs items={[
                    {
                        text: t("Agent Management"),
                        link: "/settings/agents"
                    }, {
                        text: loading ? t("Agent Permissions") : PassengerName({ passenger: agent })
                    }
                ]}/>
                <h2><span class="brand">{t("Information")}</span></h2>
                <div class="row">
                    <b>{t("Agent")}</b>:{" "}
                    {PassengerName({ passenger: agent })}
                </div>
                <div class="row">
                    <b>{t("Position")}</b>:{" "}
                    {agent.position}
                </div>
                { agent.isMaster ? <div class="row">
                    <b>{t("Main agent")}</b>
                </div> : "" }

                { authStore.activeCounterparty?.inAgencyPermissions?.includes("AgentStatusManagement") &&
                <div>
                    <button
                        class="button transparent-with-border"
                        onClick={this.enable}
                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                    >
                        {t("Enable agent")}
                    </button>
                    <button
                        class="button transparent-with-border"
                        onClick={this.disable}
                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                    >
                        {t("Disable agent")}
                    </button>
                </div> }

                <h2><span class="brand">{t("Permissions")}</span></h2>

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
            }
        </div>
        );
    }
}
