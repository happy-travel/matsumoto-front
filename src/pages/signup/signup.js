import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import NotFoundPage from "pages/common/not-found-page";
import BasicHeader from "parts/header/basic-header";
import { Loader } from "components/simple";
import { loadInvitationData, isAgentWay, isAgencyWay, isCounterpartyWay } from "tasks/signup/signup-initialization";
import {registerAgency, registerAgent, registerCounterparty} from "tasks/signup/signup-finish";
import { getAuthBlockStyle } from "tasks/signup/signup-background";
import { getInvite } from "tasks/signup/invitation";
import SignUpAgentForm from "./signup-agent-form";
import SignUpCompanyForm from "./signup-company-form";
import { $personal } from "stores";

const SignUpPage = observer(() => {
    const [loading, setLoading] = useState(false);
    const [invitationData, setInvitationData] = useState(null);
    const [agentFilledForm, setAgentFilledForm] = useState(null);
    const invitationCode = getInvite();

    useEffect(() => {
        loadInvitationData(invitationCode, setInvitationData);
    }, []);

    const submitAgentForm = (agentForm) => {
        if (isAgentWay(invitationData)) {
            setLoading(true);
            registerAgent(agentForm, setLoading, invitationData, invitationCode);
            return;
        }
        setAgentFilledForm(agentForm);
    };

    const submitCompanyForm = (companyForm) => {
        setLoading(true);

        if (isAgencyWay(invitationData))
            registerAgency(agentFilledForm, companyForm, setLoading, invitationData, invitationCode);
        if (isCounterpartyWay(invitationData))
            registerCounterparty(agentFilledForm, companyForm, setLoading);
    };

    if ($personal.information?.email)
        return <NotFoundPage />;

    return (
        <div className="account block" style={getAuthBlockStyle()}>
            <BasicHeader />
            { loading &&
                <Loader page />
            }
            <section className="section">
                { !agentFilledForm ?
                    <SignUpAgentForm
                        agentWay={isAgentWay(invitationData)}
                        initialValues={invitationData ? invitationData.userRegistrationInfo : {}}
                        submit={submitAgentForm}
                    /> :
                    <SignUpCompanyForm
                        initialValues={invitationData ? invitationData.childAgencyRegistrationInfo : {}}
                        setAgentFilledForm={setAgentFilledForm}
                        submit={submitCompanyForm}
                        agencyWay={isAgencyWay(invitationData)}
                        counterpartyWay={isCounterpartyWay(invitationData)}
                    />
                }
            </section>
        </div>
    );
});

export default SignUpPage;