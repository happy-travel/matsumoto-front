import React from "react";
import { observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import { API } from "core";
import store from "stores/auth-store";

@observer
class AccountInvite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invitationCode: null
        };
    }

    componentDidMount() {
        var invitationCode = this.props.match.params.code;
        store.setInvitationCode(invitationCode);
        this.setState({ invitationCode });
    }

    render() {
        if (this.state.invitationCode)
            return <Redirect push to="/" />;

        return null;
    }
}

export default AccountInvite;