import React from "react";
import Authorize from "./authorize";
import { Loader } from "simple";
import UI from "stores/ui-store";
import { userAuthRemoveFromStorage } from "core/auth";

class AuthLogoutComponent extends React.PureComponent {
    componentDidMount() {
        UI.dropAllFormCaches();
        userAuthRemoveFromStorage();
        Authorize.removeUser();
        Authorize.signoutRedirect();
    }

    render() {
        return <Loader white page />;
    }
}

export default AuthLogoutComponent;
