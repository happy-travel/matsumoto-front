import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { API, redirect } from "core";
import { PassengerName } from "simple";
import { Loader } from "components/simple";
import Breadcrumbs from "components/breadcrumbs";
import { FieldSwitch } from "components/form";
import SettingsHeader from "./parts/settings-header";
import Markups from "parts/markups/markups";
import { $personal } from "stores";

const generateLabel = str => {
    if (!str)
        return "Unknown";
    const split = str.split(/([A-Z])/);
    for (let i = 0; i < split.length; i++)
        if (split[i].match(/([A-Z])/))
            split[i]= " " + split[i];
    return split.join("");
};

const AgentPermissionsManagement = observer(({ match }) => {
    const [loading, setLoading] = useState(true);
    const [agent, setAgent] = useState({});
    const [permissionsList, setPermissionsList] = useState([]);

    const { agentId } = match.params;
    const { inAgencyPermissions } = agent;

    useEffect(() => {
        API.get({
            url: API.AGENCY_AGENT(agentId),
            success: (result) => {
                setAgent(result);
                setLoading(false);
            }
        });
        API.get({
            url: API.ALL_PERMISSIONS,
            success: setPermissionsList
        });
    }, []);

    const enable = () => {
        API.post({
            url: API.AGENT_ENABLE(agentId),
            success: () =>
                setAgent({
                    ...agent,
                    isActive: true
                })
        });
    };

    const disable = () => {
        API.post({
            url: API.AGENT_DISABLE(agentId),
            success: () =>
                setAgent({
                    ...agent,
                    isActive: false
                })
        });
    };

    const submit = (values) => {
        setLoading(true);
        API.put({
            url: API.AGENT_PERMISSIONS(agentId),
            body: Object.keys(values).map((key) => values[key] ? key : false).filter(item => item),
            success: () => redirect("/settings/agents"),
            after: () => setLoading(false)
        });
    };

    const { t } = useTranslation();
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
                <h2>{t("Information")}</h2>
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

                { $personal.permitted("AgentStatusManagement") &&
                  $personal.information.id != agent.agentId &&
                <div>
                    {!agent.isActive ? <button
                        className="button"
                        onClick={enable}
                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                    >
                        {t("Activate agent")}
                    </button> :
                    <button
                        className="button"
                        onClick={disable}
                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                    >
                        {t("Deactivate agent")}
                    </button>}
                </div> }

                { $personal.permitted("PermissionManagement") && <>
                    <h2>{t("Permissions")}</h2>
                    <div>
                        <Formik
                            onSubmit={submit}
                            initialValues={{
                                ...permissionsList.reduce((obj, key) => (
                                    {...obj, [key]: inAgencyPermissions.includes(key)}),
                                {})
                            }}
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
                </> }

                { $personal.permitted("MarkupManagement") &&
                    <Markups
                        id={agent.agentId}
                        emptyText={"Agent has no markups"}
                        markupsRoute={API.AGENT_MARKUPS}
                        markupRoute={API.AGENT_MARKUP}
                    />
                }
            </section>
            }
        </div>
    );
});

export default AgentPermissionsManagement;
