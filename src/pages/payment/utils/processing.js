import React from "react";
import { observer } from "mobx-react";
import { getParams, API } from "core";
import { Redirect } from "react-router-dom";
import { Loader } from "simple";
import { FORM_NAMES } from "components/form";

import store from "stores/accommodation-store";
import UI from "stores/ui-store";

import { windowSessionStorage } from "core/misc/window-storage";

@observer
class BasicPaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            directLinkCode: null,
            redirectToConfirmationPage: false
        };
    }

    setResult(data, error, params) {
        var errorLine = error?.detail || error?.title;
        if (data?.status == "Failed")
            errorLine = data.message;
        store.setPaymentResult({
            params: params,
            result: {
                status: data?.status,
                error: errorLine
            }
        });
    }

    finalize(reference, data, error, params) {
        this.setResult(data, error, params);
        if (!error) {
            API.post({
                url: API.A_BOOKING_FINALIZE(reference),
                after: (data, error) => {
                    if (error?.detail)
                        this.setResult(data, error, params);
                    else
                        UI.dropFormCache(FORM_NAMES.BookingForm);

                    this.setState({
                        redirectToConfirmationPage: true
                    });
                }
            });
        } else
            this.setState({
                redirectToConfirmationPage: true
            });
    }

    callback(data, error, after3ds, directLinkCode) {
        var params = getParams();

        if (!after3ds && ("Secure3d" == data?.status)) {
            window.location.href = data.secure3d;
            return;
        }

        if (directLinkCode) {
            this.setResult(data, error, params);
            this.setState({
                redirectToConfirmationPage: true
            });
            return;
        }

        this.finalize(
            params.merchant_reference,
            data,
            error,
            params
        );
    }

    render() {
        if (this.state.redirectToConfirmationPage) {
            if (this.state.directLinkCode)
                return <Redirect push to="/payment/confirmation" />;
            return <Redirect push to="/accommodation/confirmation"/>;
        }

        return <React.Fragment>
            <Loader white page />
            {__devEnv &&
                <div className="top-alert development">
                    <a href={("http://localhost:4000" + window.location.pathname + window.location.search)}>Process to localhost</a>
                </div>}
        </React.Fragment>;
    }
}

export default BasicPaymentPage;
