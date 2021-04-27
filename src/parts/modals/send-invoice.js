import React, { useState, useEffect } from "react";
import { API } from "core";
import { INVOICE_TYPES } from "enum";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { emailFormValidator } from "components/form/validation";
import { $ui, $view } from "stores";

const SendInvoiceModal = observer(({ closeModal }) => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState({});

    useEffect(() => {
        API.get({
            url: API.BOOKING_GET_BY_ID($view.modalData.bookingId),
            success: setBooking
        });
    });

    const submit = (values) => {
        const { bookingId, type } = $view.modalData;
        setLoading(true);
        API.post({
            url: type == INVOICE_TYPES.VOUCHER
                    ? API.BOOKING_VOUCHER_SEND(bookingId)
                    : API.BOOKING_INVOICE_SEND(bookingId),
            body: values,
            success: () => {
                setSuccess(true);
                $ui.dropFormCache(FORM_NAMES.SendInvoiceForm);
            },
            error: () => setError(true),
            after: () => setLoading(false)
        });
    };

    const { t } = useTranslation();
    const { type } = $view.modalData;

    return (
        <div className="confirm modal">
            {closeModal && <div className="close-button" onClick={closeModal}>
                <span className="icon icon-close" />
            </div>}

            <h2>{type == INVOICE_TYPES.VOUCHER ? t("Send Voucher") : t("Send Invoice")}</h2>

            { error && <div>{t("An error occured")}</div>}

            { success &&
                <div>{
                    type == INVOICE_TYPES.VOUCHER
                        ? t("Booking voucher has been sent")
                        : t("Booking invoice has been sent")
                }</div>
            }

            { loading && <div>{t("Loading...")}</div>}

            { !error && !success && !loading &&
                <CachedForm
                    id={ FORM_NAMES.SendInvoiceForm }
                    initialValues={{ email: "" }}
                    validationSchema={emailFormValidator}
                    onSubmit={submit}
                    render={formik => (
                        <>
                            <div className="form">
                                <p>
                                    {t("Enter email to receive information about booking")} <br/>
                                    { booking?.bookingDetails?.referenceCode }.
                                </p>
                                <div className="row">
                                    <FieldText formik={formik}
                                        id="email"
                                        placeholder={t("Email")}
                                    />
                                </div>
                                <div className="bottom">
                                    <button className="button" type="submit">
                                        {t("Confirm")}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                />
            }
        </div>
    );
});

export default SendInvoiceModal;
