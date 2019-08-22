import React from "react";
import Authorize from "./authorize";
import { withRouter } from "react-router-dom";

class AuthSilentCallbackComponent extends React.PureComponent {

    componentDidMount() {
        Authorize.signinSilentCallback().catch((err) => {
            console.log(err);
        });
    }

    onRedirectSuccess = (user) => {
    };

    onRedirectError = (error) => {

    };

    render() {
        return null; // (<div>Redirecting...</div>);
    }
}


export default (withRouter(AuthSilentCallbackComponent));



