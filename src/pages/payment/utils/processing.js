import React from "react";
import { observer } from "mobx-react";
import { getParams, API, session } from "core";
import UI from "stores/ui-store";
import { FORM_NAMES } from "components/form";
import store from "stores/accommodation-store";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";

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
        store.setPaymentResult({
            params: params,
            result: {
                status: data?.status,
                error: error?.detail || error?.title
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

    callback(data, error, after3ds) {
        var params = getParams(),
            directLinkCode = session.get(params.merchant_reference);

        if (!after3ds && ("Secure3d" == data?.status)) {
            window.location.href = data.secure3d;
            return;
        }

        if (!directLinkCode)
            this.finalize(
                params.merchant_reference,
                data,
                error,
                params
            );
        else
            this.setState({
                redirectToConfirmationPage: true
            });

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
