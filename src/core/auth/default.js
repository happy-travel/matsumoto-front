import React from "react";
import Authorize from "./authorize";
import { withRouter } from "react-router-dom";
import { isPageAvailableAuthorizedOnly, Authorized } from "core/auth";
import { Loader } from "simple";

class AuthDefaultComponent extends React.PureComponent {
    render() {
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

export default (withRouter(AuthDefaultComponent));
