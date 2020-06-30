import React from "react";
import Authorize from "./authorize";

class AuthSilentCallbackComponent extends React.PureComponent {

    componentDidMount() {
        Authorize.signinSilentCallback().catch(error => {
            console.error("Silent auth failed: " + error);
        });
    }

    render() {
        return null;
    }
}


export default AuthSilentCallbackComponent;



