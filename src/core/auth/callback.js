import React from "react";
import Authorize from "./authorize";
import { withRouter } from "react-router-dom";
import { init } from "core";

class AuthCallbackComponent extends React.PureComponent {

    componentDidMount() {
        Authorize.signinRedirectCallback()
            .then((user) => this.onRedirectSuccess(user))
            .catch((error) => this.onRedirectError(error));
    }

    onRedirectSuccess = (user) => {
        this.props.history.push("/");
        init(); //todo: rewrite logic where init is after authorization code
    };

    onRedirectError = (error) => {
        this.props.history.push("/");
    };

    render() {
        return null; // (<div>Redirecting...</div>);
    }
}


export default (withRouter(AuthCallbackComponent));