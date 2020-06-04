import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import UI from "stores/ui-store";
import ViewFailed from "parts/view-failed";

@observer
class PaymentInformation extends React.Component {
    render() {
        var { t } = useTranslation();

        var {
            params_error,
            params,
            result
        } = this.props;

        return (
            <React.Fragment>
                { params_error && <div class={"result-code error"}>
                    <div class="before">
                        <span class="icon icon-close white" />
                    </div>
                    <div class="dual">
                        <div class="first">
                            {t("Card acceptance message")}: <strong>{params?.response_message}</strong>
                        </div>
                        <div class="second">
                            {t("Response code")}: <strong>{params?.response_code}</strong>
                        </div>
                    </div>
                </div> }

                { result.error ?
                <ViewFailed
                    reason={
                        <React.Fragment>
                            {t("Payment failed")}<br/>
                            {result.error}
                        </React.Fragment>
                    }
                    button={t("Try to pay again")}
                    link="/payment/form"
                />
                    :
                <div class="result-code">
                    { !!result.status && <div class="before">
                        <span class="icon icon-white-check" />
                    </div> }
                    <div class="dual">
                        <div class="first">
                            {t("Payment result")}: <strong>{result.status || "Unknown"}</strong>
                        </div>
                    </div>
                </div> }

                { (UI.saveCreditCard && !result.error) && <div>
                    {t("Your card was saved for your future purchases.")}
                </div> }
            </React.Fragment>
        );
    }
}

export default PaymentInformation;
