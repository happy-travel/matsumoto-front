import React from "react";
import settings from "settings";
import { observer } from "mobx-react";
import BasicHeader from "parts/header/basic-header";
import { API, redirect } from "core";
import { date } from "simple";
import { Loader } from "components/simple";
import { windowLocalStorage } from "core/misc/window-storage";
import { authSetDirectPayment } from "core/auth";
import { useTranslation } from "react-i18next";
import PaymentForm from "../parts/payment-form";
import ReactTooltip from "react-tooltip";
import { payDirectByForm } from "tasks/payment/direct/direct-processing";
import { loadDirectPaymentServiceData } from "tasks/payment/direct/direct-service";
import { $payment } from "stores";

@observer
class PaymentDirectLinkPage extends React.Component {
    state = {
        order: null
    };

    async componentDidMount() {
        const orderCode = this.props.match.params.code;
        const [service, order] = await Promise.all([
            loadDirectPaymentServiceData(),
            API.get({
                external_url: API.DIRECT_LINK_PAY.GET_INFO(orderCode),
                error: () => this.setState({ loading: false })
            })
        ]);
        $payment.setSubject(order.referenceCode, {
            amount: order.amount,
            currency: order.currency
        });
        $payment.setService(
            service,
            `${settings.direct_payment_callback_host}/payment/result/${order.referenceCode}`
        );
        authSetDirectPayment();
        windowLocalStorage.set(order.referenceCode, orderCode);

        if ("Success" == order.creditCardPaymentStatus) {
            $payment.setPaymentResult("Success");
            redirect("/pay/confirmation");
            return;
        }

        this.setState({
            loading: false,
            order
        });
    }

    render() {
        const { t } = useTranslation();
        const { order } = this.state;

        return (
            <>
                <BasicHeader />
                { !order ?
                    <Loader /> :
                    <div className="payment block">
                        <section>
                            <h2>
                                Payment order {order.referenceCode}<br/>
                                {date.format.a(order.date)}
                            </h2>
                            { !!order.comment &&
                                <div className="accent-frame">
                                    <div className="data only">
                                        {order.comment.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}<br/>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            }
                            <h2>
                                {t("Please Enter Your Card Details")}
                            </h2>
                            <PaymentForm
                                pay={payDirectByForm}
                                total={$payment.subject.price}
                                hideCardSaveCheckbox
                            />
                        </section>
                        <ReactTooltip place="top" type="dark" effect="solid" />
                    </div>
                }
            </>
        );
    }

}

export default PaymentDirectLinkPage;
