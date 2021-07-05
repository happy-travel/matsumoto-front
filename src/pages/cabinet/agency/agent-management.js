import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { API, redirect } from "core";
import { PassengerName } from "simple";
import { Loader } from "components/simple";
import Breadcrumbs from "components/breadcrumbs";
import Markups from "parts/markups/markups";
import PermissionsSelector from "./permissions-selector";
import { $personal } from "stores";

const AgentManagement = observer(({ match }) => {
    const [loading, setLoading] = useState(true);
    const [agent, setAgent] = useState({});
    const { agentId } = match.params;
    const { inAgencyRoleIds } = agent;

    useEffect(() => {
        API.get({
            url: API.AGENCY_AGENT(agentId),
            success: (result) => {
                setAgent(result);
                setLoading(false);
            }
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
            url: API.AGENT_ROLES(agentId),
            body: Object.keys(values).map((key) => values[key] ? parseInt(key) : false).filter(item => item),
            success: () => redirect("/settings/agency/agents"),
            after: () => setLoading(false)
        });
    };

    const { t } = useTranslation();
    return (
        <div className="cabinet block">
            { loading ?
                <Loader /> :
            <section>
                <Breadcrumbs
                    backLink="/settings/agency/agents"
                    backText={t("Back to") + " " + t("Agents Management")}
                />
                <div>
                    <h2>{t("Information")}</h2>
                    <div className="row">
                        <b>{t("Agent")}</b>:{" "}
                        { PassengerName({ passenger: agent }) }
                    </div>
                    <div className="row">
                        <b>{t("Position")}</b>:{" "}
                        {agent.position}
                    </div>
                    <div className="row">
                        <b>{t("Status")}</b>:{" "}
                        { agent.isActive ? "Active" : "Inactive" }
                    </div>
                    { agent.isMaster &&
                        <div className="row">
                            <b>{t("Main agent")}</b>
                        </div>
                    }

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
                        </div>
                    }
                </div>

                { $personal.permitted("PermissionManagement") && <div>
                    <h2>{t("Permissions")}</h2>
                    <div>
                        <Formik
                            onSubmit={submit}
                            initialValues={{
                                ...inAgencyRoleIds.reduce((obj, key) => (
                                    {...obj, [key]: inAgencyRoleIds.includes(key)}),
                                {})
                            }}
                        >
                            { formik => (
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form">
                                        <PermissionsSelector formik={formik} />
                                        <div className="row controls">
                                            <div className="field">
                                                <div className="label"/>
                                                <div className="inner">
                                                    <button
                                                        type="submit"
                                                        className={
                                                            "button button-controls" +
                                                            __class(!formik.dirty, "disabled")
                                                        }
                                                    >
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
                </div> }

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

export default AgentManagement;
