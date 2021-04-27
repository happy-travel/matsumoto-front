import React, { useEffect } from "react";
import Authorize from "./authorize";
import { Loader } from "components/simple";
import { authRemoveFromStorage } from "core/auth";
import { $ui, $personal } from "stores";

const AuthLogoutComponent = () => {
    useEffect(() => {
        $ui.dropAllFormCaches();
        $personal.setInformation({ email: null });
        authRemoveFromStorage();
        Authorize.signoutRedirect();
    }, []);

    return <Loader white page />;
};

export default AuthLogoutComponent;
