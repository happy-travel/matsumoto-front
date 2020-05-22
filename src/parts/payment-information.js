import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

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

                <div class={"result-code" + (result.error ? " error" : "")}>
                    { (result.status || result.error) && <div class="before">
                        { result.error ? <span class="icon icon-close white" /> : <span class="icon icon-white-check" /> }
                    </div> }
                    <div class="dual">
                        <div class="first">
                            {t("Payment result")}: <strong>{result.status || result.error}</strong>
                        </div>
                    </div>
                </div>

                { ("YES" == params.remember_me && !result.error) && <div>
                    {t("Your card was saved for your future purchases.")}
                </div> }
            </React.Fragment>
        );
    }
}

export default PaymentInformation;
