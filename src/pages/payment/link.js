import React from "react";
import { observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";

@observer
class PaymentDirectLinkPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        var orderCode = this.props.match.params.code;

    }

    render() {
        return <Loader />;
    }
}

export default PaymentDirectLinkPage;
