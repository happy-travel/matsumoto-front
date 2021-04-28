import { API } from "core";

export const loadInvitationData = (code, setResult) => {
    if (code)
        API.get({
            url: API.INVITATION_DATA(code),
            success: setResult
        });
};

export const isCounterpartyWay = (invitationData) => !invitationData;

export const isAgencyWay = (invitationData) => "ChildAgency" == invitationData?.userInvitationType;

export const isAgentWay = (invitationData) => !isCounterpartyWay(invitationData) && !isAgencyWay(invitationData);
