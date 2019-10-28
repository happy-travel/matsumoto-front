import React from "react";
import { observer } from "mobx-react";
import { dateFormat, price, getParams, API } from "core";

import { Dual } from "components/simple";

import store from "stores/accommodation-store";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";

@observer
class Payment3DSecureCallbackPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToConfirmationPage: false
        };
    }

    componentDidMount() {
        var params = getParams(),
            paymentResult = {
                params,
                saved: params.remember_me == "YES"
            };
        API.post({
            url: API.PAYMENTS_CALLBACK,
            body: getParams(),
            after: (data, error) => {
                paymentResult.result = {
                    status: data?.status,
                    error: error?.detail
                };
                store.setPaymentResult(paymentResult);
                this.setState({
                    redirectToConfirmationPage: true
                });
            }
        });
    }

    render() {
        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return <Loader />;
    }
}

export default Payment3DSecureCallbackPage;
