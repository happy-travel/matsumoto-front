import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { windowLocalStorage } from "core/misc/window-storage";
import BasicHeader from "parts/header/basic-header";
import { Dual } from "components/simple";
import { price } from "simple";
import ViewFailed from "parts/view-failed";
import { $payment } from "stores";

const messageFormatter = str => str.split("+").join(" ");

const DirectLinkConfirmationPage = observer(() => {
    const [booking, setBooking] = useState({});

    useEffect(() => {
        const code = windowLocalStorage.get($payment.subject.referenceCode);
        if (!code) {
            setBooking({ error: "error" });
            return;
        }
        API.get({
            external_url: API.DIRECT_LINK_PAY.GET_INFO(code),
            after: result => {
                setBooking(result || { error: "error" });
            }
        });
    }, []);

    const { status, error } = $payment.paymentResult;
    const { subject } = $payment;

    const { t } = useTranslation();
    return (
        <>
            <BasicHeader />
            <div className="payment block">
                <section>
                    { "Success" == status ?
                    <>
                        <h2>{t("Order has been paid successfully")}</h2>

                        <div className="accent-frame">
                            <div className="before">
                                <span className="icon icon-success" />
                            </div>
                            <div className="data">
                                <div className="first">
                                    {t("Order reference number")}<br />
                                    <span className="status Success">{subject.referenceCode}</span>
                                </div>
                                <div className="second">
                                    {t("Payment Result")}<br />
                                    <span className="status Success">{status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="part">
                            <div className="icon-holder">
                                <span className="icon icon-confirmation-price"/>
                            </div>
                            <div className="line">
                                <Dual
                                    a={t("Amount")}
                                    b={ price(subject.price) }
                                />
                            </div>
                        </div>
                        { booking.comment && <div className="part">
                            <div className="line">
                                <div className="icon-holder">
                                    <span className="icon icon-confirmation-hotel"/>
                                </div>
                                <Dual className="line"
                                      a={t('Additional Information')}
                                      b={booking.comment}
                                />
                            </div>
                        </div> }
                    </> :
                    <>
                        { error &&
                            <div className="accent-frame">
                                <div className="before">
                                    <span className="icon icon-warning" />
                                </div>
                                <div className="data">
                                    <div className="first">
                                        {t("Payment message")}<br/>
                                        <strong>{messageFormatter(error)}</strong>
                                    </div>
                                </div>
                            </div>
                        }
                        <ViewFailed
                            reason={
                                <>
                                    {t("Payment failed")}<br/>
                                    {error}
                                </>
                            }
                            button={t("Try to pay again")}
                            link={`/pay/${booking.code}`}
                        />
                    </>
                    }
                </section>
            </div>
        </>
    );
});

export default DirectLinkConfirmationPage;
