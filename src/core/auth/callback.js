import React from "react";
import Authorize from "./authorize";
import { Loader } from "components/simple";
import { authSetToStorage } from "./index";
import { lastPage } from "core/misc/tracker";

class AuthCallbackComponent extends React.PureComponent {
    componentDidMount() {
        Authorize.removeUser();
        Authorize.signinRedirectCallback()
            .then(this.onRedirectSuccess)
            .catch(this.onRedirectError);
    }

    onRedirectSuccess = auth => {
        Authorize.clearStaleState();
        authSetToStorage(auth);
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
