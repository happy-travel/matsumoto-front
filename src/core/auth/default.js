import React from "react";
import Authorize from "./authorize";
import { withRouter } from "react-router-dom";
import { isRedirectNeeded } from "core/init";
import store from "stores/auth-store";
import { Loader } from "components/simple";

class AuthDefaultComponent extends React.PureComponent {
    render() {
        if (isRedirectNeeded()) {
            Authorize.getUser().then(user => {
                store.setUserCache(user);
                if (!user?.access_token)
                    Authorize.signinRedirect();
            });
            if (!store.userCache?.access_token)
                return <Loader white page />;
        }

        return null;
    }
}

export default (withRouter(AuthDefaultComponent));
