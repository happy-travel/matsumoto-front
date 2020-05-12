import React from "react";
import BasicPaymentPage from "./utils/processing";
import { observer } from "mobx-react";
import { API } from "core"
import store from "stores/accommodation-store";

@observer
class AccountPaymentPage extends BasicPaymentPage {
    constructor(props) {
        super(props);
        this.render = super.render.bind(this);
    }
    componentDidMount() {
        API.post({
            url: API.PAYMENTS_ACC_COMMON,
            body: {
                referenceCode: store.booking.referenceCode
            },
            after: (data, error) => {
                this.finalize(
                    store.booking.referenceCode,
                    data,
                    error,
                    {
                        response_message: "Success",
                        referenceCode: store.booking.referenceCode
                    }
                );
            }
        });
    }
}

export default AccountPaymentPage;
