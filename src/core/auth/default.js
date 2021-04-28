import React, { useEffect } from "react";
import Authorize from "./authorize";
import { isPageAvailableAuthorizedOnly, Authorized } from "core/auth";
import { initAgent } from "core/init";

const AuthDefaultComponent = () => {
    useEffect(() => {
        if (Authorized())
            initAgent();

        if (isPageAvailableAuthorizedOnly()) {
            Authorize.getUser().then(user => {
                if (!user?.access_token)
                    Authorize.signinRedirect();
            });
        }
    }, []);

    return null;
};

export default AuthDefaultComponent;
