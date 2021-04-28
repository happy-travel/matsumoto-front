import React, { useEffect } from "react";
import Authorize from "./authorize";
import { authSetToStorage } from "./index";
import { lastPage } from "core/misc/tracker";

const AuthCallbackComponent = ({ history }) => {
    const onRedirectSuccess = (auth) => {
        Authorize.clearStaleState();
        authSetToStorage(auth);
        history.push(lastPage());
    };

    const onRedirectError = () => {
        history.push(lastPage());
    };

    useEffect(() => {
        Authorize.signinRedirectCallback()
            .then(onRedirectSuccess)
            .catch(onRedirectError);
    });

    return null;
};

export default AuthCallbackComponent;
