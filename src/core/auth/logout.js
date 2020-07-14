import React from "react";
import Authorize from "./authorize";
import { Loader } from "simple";
import { userAuthRemoveFromStorage } from "core/auth";

import UI from "stores/ui-store";
import authStore from "stores/auth-store";

class AuthLogoutComponent extends React.PureComponent {
    componentDidMount() {
        UI.dropAllFormCaches();
        authStore.setUser({ email: null });
        userAuthRemoveFromStorage();
        Authorize.signoutRedirect();
    }

    render() {
        return <Loader white page />;
    }
}

export default AuthLogoutComponent;
