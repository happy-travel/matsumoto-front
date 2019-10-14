import React from "react";
import Authorize from "./authorize";
import { withRouter } from "react-router-dom";

/* Refactoring possibility: rewrite auth to vanilla, remove react components */
class AuthDefaultComponent extends React.PureComponent {
    componentDidMount() {
        Authorize.getUser().then(user => {
            if (!user || !user.access_token) {
                if (window.location.href.indexOf("/signup/invite") < 0)
                    Authorize.signinRedirect();
            }
        });
    }

    render() {
        return null;
    }
}

export default (withRouter(AuthDefaultComponent));
