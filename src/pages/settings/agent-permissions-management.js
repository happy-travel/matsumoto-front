import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { API, redirect } from "core";
import { Loader, PassengerName } from "simple";
import Breadcrumbs from "components/breadcrumbs";
import { FieldSwitch } from "components/form";
import SettingsHeader from "./parts/settings-header";
import AgentMarkup from "./parts/agent-markup";
import authStore from "stores/auth-store";

const generateLabel = str => {
    if (!str)
        return "Unknown";
    var split = str.split(/([A-Z])/);
    for (var i = 0; i < split.length; i++)
        if (split[i].match(/([A-Z])/))
            split[i]= " " + split[i];
    return split.join("");
};

@observer
export default class AgentPermissionsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            agent: {},
            permissionsList: []
        };
    }

    enable = () => {
        const { agentId } = this.props.match.params;
        API.post({
            url: API.AGENT_ENABLE(agentId),
            success: () => this.setState({
                agent: {
                    ...this.state.agent,
                    isActive: true
                }
            })
        });
    };

    disable = () => {
        const { agentId } = this.props.match.params;
        API.post({
            url: API.AGENT_DISABLE(agentId),
            success: () => this.setState({
                agent: {
                    ...this.state.agent,
                    isActive: false
                }
            })
        });
    };

    componentDidMount() {
        if (this.props.match?.params) {
            const { agentId } = this.props.match.params;

            API.get({
                url: API.AGENCY_AGENT(agentId),
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

    submit = (values) => {
        this.setState({ loading: true });

        var { agentId } = this.props.match.params,
            url = API.AGENT_PERMISSIONS(agentId),
            body = Object.keys(values).map((key) => values[key] ? key : false).filter(item => item);

        API.put({
            url,
            body,
            success: () => redirect("/settings/agents"),
            after: () => this.setState({ loading: false })
        });
    };

    render() {
        var { t } = useTranslation(),
            { agent, permissionsList, loading } = this.state,
            { inAgencyPermissions } = agent;

        return (
        <div className="settings block">
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
                <h2><span className="brand">{t("Information")}</span></h2>
                <div className="row">
                    <b>{t("Agent")}</b>:{" "}
                    {PassengerName({ passenger: agent })}
                </div>
                <div className="row">
                    <b>{t("Position")}</b>:{" "}
                    {agent.position}
                </div>
                <div className="row">
                    <b>{t("Status")}</b>:{" "}
                    {agent.isActive ? "Active" : "Inactive"}
                </div>
                { agent.isMaster ? <div className="row">
                    <b>{t("Main agent")}</b>
                </div> : "" }

                { authStore.permitted("AgentStatusManagement") &&
                  authStore.user.id != agent.agentId &&
                <div>
                    {!agent.isActive ? <button
                        className="button transparent-with-border"
                        onClick={this.enable}
                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                    >
                        {t("Activate agent")}
                    </button> :
                    <button
                        className="button transparent-with-border"
                        onClick={this.disable}
                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                    >
                        {t("Deactivate agent")}
                    </button>}
                </div> }

                <h2><span className="brand">{t("Permissions")}</span></h2>

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
                                <div className="form">
                                    <div className="permissions">
                                        {permissionsList.map(key => (
                                            <div className="row" key={key}>
                                                <FieldSwitch formik={formik}
                                                             id={key}
                                                             label={generateLabel(key)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row controls">
                                        <div className="field">
                                            <div className="label"/>
                                            <div className="inner">
                                                <button type="submit" className={"button button-controls" +
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

                <AgentMarkup
                    agentId={agent.agentId}
                />
            </section>
            }
        </div>
        );
    }
}
