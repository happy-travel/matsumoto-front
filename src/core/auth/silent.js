import React, { useEffect } from "react";
import Authorize from "./authorize";

const AuthSilentCallbackComponent = () => {
    useEffect(() => {
        Authorize.signinSilentCallback().catch(error => {
            console.error("Silent auth failed: " + error);
        });
    }, []);

    return null;
};

export default AuthSilentCallbackComponent;
