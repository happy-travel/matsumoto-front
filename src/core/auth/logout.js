import React from "react";
import Authorize from "./authorize";
import { Loader } from "components/simple";
import { authRemoveFromStorage } from "core/auth";
import { $ui, $personal } from "stores";

class AuthLogoutComponent extends React.PureComponent {
    componentDidMount() {
        $ui.dropAllFormCaches();
        $personal.setInformation({ email: null });
        authRemoveFromStorage();
        Authorize.signoutRedirect();
    }

    render() {
        return <Loader white page />;
    }
}

export default AuthLogoutComponent;
