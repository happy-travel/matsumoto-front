import React from "react";
import { observer } from "mobx-react";
import { API } from "core"
import { Loader } from "components/simple";
import store from "stores/accommodation-store";
import {Redirect} from "react-router-dom";

@observer
class AccountPaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToConfirmationPage: false
        };
    }

    componentDidMount() {
        API.post({
            url: API.PAYMENTS_ACC_COMMON,
            body: {
                referenceCode: store.booking.referenceCode
            },
            after: (data, error) => {
                store.setPaymentResult({
                    params: {
                        response_message: "Success",
                        referenceCode: store.booking.referenceCode
                    },
                    result: {
                        status: data?.status,
                        error: error?.detail || error?.title
                    }
                });
                API.post({
                    url: API.A_BOOKING_FINALIZE(store.booking.referenceCode),
                    after: () => {
                        this.setState({
                            redirectToConfirmationPage: true
                        });
                    }
                });
            }
        });
    }

    render() {
        if (this.state.redirectToConfirmationPage)
            return <Redirect push to="/accommodation/confirmation" />;

        return <Loader white page />;
    }
}

export default AccountPaymentPage;
