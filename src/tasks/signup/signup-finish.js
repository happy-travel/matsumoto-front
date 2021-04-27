import {API, redirect} from "core";
import { authSetToStorage } from "core/auth";
import { fillEmptyAgentSettings } from "tasks/utils/agent-settings";
import { PAYMENT_METHODS } from "enum";
import { forgetInvite } from "tasks/signup/invitation";
import { FORM_NAMES } from "components/form";
import { $notifications, $personal, $ui } from "stores";

const afterSuccessfulRegistration = () => {
    API.get({
        url: API.AGENT,
        success: (agent) => {
            authSetToStorage(agent);
            if (agent?.email) {
                $personal.setInformation(agent);
                $notifications.addNotification("Registration Completed!", "Great!", "success");
            }
            fillEmptyAgentSettings();
            forgetInvite();
            $ui.dropFormCache(FORM_NAMES.RegistrationAgentForm);
            $ui.dropFormCache(FORM_NAMES.RegistrationCompanyForm);
        }
    });
    redirect("/");
};

export const registerCounterparty = (agentForm, companyForm, setLoading) => {
    API.post({
        url: API.AGENT_REGISTER_MASTER,
        body: {
            agent: agentForm,
            counterparty: {
                counterpartyInfo: {
                    name: companyForm.name,
                    legalAddress: companyForm.legalAddress || companyForm.address,
                    preferredPaymentMethod: companyForm.preferredPaymentMethod || PAYMENT_METHODS.CARD
                },
                rootAgencyInfo: companyForm
            }
        },
        success: afterSuccessfulRegistration,
        error: () => setLoading(false)
    });
};

export const registerAgent = (agentForm, setLoading, invitationData, invitationCode) => {
    API.post({
        url: API.AGENT_REGISTER,
        body: {
            registrationInfo: {
                ...agentForm,
                email: invitationData.email
            },
            invitationCode: invitationCode
        },
        success: afterSuccessfulRegistration,
        error: () => setLoading(false)
    });
};

export const registerAgency = (agentForm, companyForm, setLoading, invitationData, invitationCode) => {
    API.post({
        url: API.AGENCY_REGISTER,
        body: {
            registrationInfo: {
                ...agentForm,
                email: invitationData.email
            },
            childAgencyRegistrationInfo: companyForm,
            invitationCode
        },
        success: afterSuccessfulRegistration,
        error: () => setLoading(false)
    });
};
