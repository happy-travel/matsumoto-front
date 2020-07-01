import React from "react";
import Authorize from "./authorize";
import { isPageAvailableAuthorizedOnly, Authorized } from "core/auth";
import { Loader } from "simple";
import { initUser } from "core/init";

class AuthDefaultComponent extends React.PureComponent {
    render() {
        if (Authorized())
            initUser();

        if (isPageAvailableAuthorizedOnly()) {
            Authorize.getUser().then(user => {
                if (!user?.access_token)
                    Authorize.signinRedirect();
            });
            if (!Authorized())
                return <Loader white page />;
        }

        return null;
    }
}

export default AuthDefaultComponent;
