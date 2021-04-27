import React, { useState, useEffect } from "react";
import Authorize from "core/auth/authorize";

const AccountInvite = ({ match }) => {
    const [invitation, setInvitation] = useState({});

    useEffect(() => {
        setInvitation(match?.params || {})
    }, []);

    if (invitation.code && invitation.email) {
        Authorize.removeUser();
        Authorize.signinRedirect({
            extraQueryParams: {
                customRedirectUrl: window.auth_host + "?invCode=" + invitation.code,
                redirectToRegister: true,
                userMail: invitation.email
            }
        });
    }

    return null;
};

export default AccountInvite;