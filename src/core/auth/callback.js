import React from "react";
import Authorize from "./authorize";
import { initUser } from "core/init";
import { Loader } from "simple";
import { userAuthSetToStorage } from "./index";
import { lastPage } from "core/misc/tracker";

class AuthCallbackComponent extends React.PureComponent {
    componentDidMount() {
        Authorize.removeUser();
        Authorize.signinRedirectCallback()
            .then((user) => this.onRedirectSuccess(user))
            .catch((error) => this.onRedirectError(error));
    }

    onRedirectSuccess = user => {
        Authorize.clearStaleState();
        userAuthSetToStorage(user);
        initUser();
        this.props.history.push(lastPage());
    };

    onRedirectError = error => {
        this.props.history.push("/");
    };

    render() {
        return <Loader page />;
    }
}

export default AuthCallbackComponent;
