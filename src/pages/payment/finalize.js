import React from "react";
import { observer } from "mobx-react";
import { API } from "core";
import store from "stores/accommodation-store";
import { Redirect } from "react-router-dom";
import { Loader } from "components/simple";
import UI from "stores/ui-store";
import { FORM_NAMES } from "components/form";

@observer
class FinalizePaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            directLinkCode: null,
            redirectToConfirmationPage: false
        };
        this.callback = this.callback.bind(this);
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
        API.post({
            url: API.A_BOOKING_FINALIZE(reference),
            after: (data, error) => {
                error = {
                    status: 400,
                    detail: "Hotel Not Available for Booking"
                };
                if (error?.detail)
                    this.setResult(data, error, params);
                else
                    UI.dropFormCache(FORM_NAMES.BookingForm);

                this.setState({
                    redirectToConfirmationPage: true
                });
            }
        });
    }

    render() {
        if (this.state.directLinkCode && this.state.redirectToConfirmationPage)
            return <Redirect push to="/payment/confirmation" />;

        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return <Loader white page />;
    }
}

export default FinalizePaymentPage;
