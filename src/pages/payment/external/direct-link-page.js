import React, { useEffect, useState } from "react";
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

const PaymentDirectLinkPage = observer(({ match }) => {
    const [order, setOrder] = useState(null);

    useEffect(() => {
       const load = async () => {
           const orderCode = match.params.code;
           const [service, loadedOrder] = await Promise.all([
               loadDirectPaymentServiceData(),
               API.get({
                   external_url: API.DIRECT_LINK_PAY.GET_INFO(orderCode)
               })
           ]);
           $payment.setSubject(loadedOrder.referenceCode, {
               amount: loadedOrder.amount,
               currency: loadedOrder.currency
           });
           $payment.setService(
               service,
               `${settings.direct_payment_callback_host}/payment/result/${loadedOrder.referenceCode}`
           );
           authSetDirectPayment();
           windowLocalStorage.set(loadedOrder.referenceCode, orderCode);

           if ("Success" == loadedOrder.creditCardPaymentStatus) {
               $payment.setPaymentResult("Success");
               redirect("/pay/confirmation");
               return;
           }
           setOrder(loadedOrder);
       };
       load();
    }, []);

    const { t } = useTranslation();
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
                                    { order.comment.split('\n').map((line, index) => (
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
});

export default PaymentDirectLinkPage;
