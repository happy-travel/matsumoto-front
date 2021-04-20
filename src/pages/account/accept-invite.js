import React from "react";
import { observer } from "mobx-react";
import Authorize from "core/auth/authorize";

@observer
class AccountInvite extends React.Component {
    state = {
        invitation: {}
    };

    componentDidMount() {
        var invitation = this.props?.match?.params || {};
        this.setState({ invitation });
    }

    render() {
        if (this.state.invitation.code && this.state.invitation.email) {
            Authorize.removeUser();
            Authorize.signinRedirect({
                extraQueryParams: {
                    customRedirectUrl: window.auth_host + "?invCode=" + this.state.invitation.code,
                    redirectToRegister: true,
                    userMail: this.state.invitation.email
                }
            });
        }

        return null;
    }
}

export default AccountInvite;