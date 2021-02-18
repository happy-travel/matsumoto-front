import React from "react";
import settings from "settings";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { API, redirect } from "core";
import { Loader, dateFormat } from "simple";
import { windowLocalStorage } from "core/misc/window-storage";
import { userAuthSetDirectPayment } from "core/auth";
import {useTranslation} from "react-i18next";
import PaymentForm from "../parts/payment-form";
import ReactTooltip from "react-tooltip";
import { payDirectByForm } from "tasks/payment/direct/direct-processing";
import { loadDirectPaymentServiceData } from "tasks/payment/direct/direct-service";
import paymentStore from "stores/payment-store";

@observer
class PaymentDirectLinkPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null
        };
    }

    async componentDidMount() {
        const orderCode = this.props.match.params.code;
        const [service, order] = await Promise.all([
            loadDirectPaymentServiceData(),
            API.get({
                external_url: API.DIRECT_LINK_PAY.GET_INFO(orderCode),
                error: () => this.setState({ loading: false })
            })
        ]);
        paymentStore.setSubject(order.referenceCode, {
            amount: order.amount,
            currency: order.currency
        });
        paymentStore.setService(
            service,
            `${settings.direct_payment_callback_host}/payment/result/${order.referenceCode}`
        );
        userAuthSetDirectPayment();
        windowLocalStorage.set(order.referenceCode, orderCode);

        if ("Success" == order.creditCardPaymentStatus) {
            paymentStore.setPaymentResult("Success");
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
                <header>
                    <section>
                        <div className="logo-wrapper">
                            <Link to="/" className="logo" />
                        </div>
                    </section>
                </header>
                { !order ?
                    <Loader /> :
                    <div className="confirmation block payment">
                        <section className="double-sections">
                            <div className="middle-section">
                                <h2>
                                    Payment order {order.referenceCode} {dateFormat.b(order.date)}
                                </h2>
                                <p className="remark">
                                    {order.comment.split('\n').map(line => (
                                        <React.Fragment>
                                            {line}<br/>
                                        </React.Fragment>
                                    ))}
                                </p>
                                <h2 className="payment-title">
                                    {t("Please Enter Your Card Details")}
                                </h2>
                                <PaymentForm
                                    pay={payDirectByForm}
                                    total={paymentStore.subject.price}
                                    hideCardSaveCheckbox
                                />
                            </div>
                        </section>
                        <ReactTooltip place="top" type="dark" effect="solid" />
                    </div>
                }
            </>
        );
    }

}

export default PaymentDirectLinkPage;
