import React from "react";
import { CachedForm, FieldText } from "components/form";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat } from "core";
import UI, { INVOICE_TYPES } from "stores/ui-store";
import { emailFormValidator } from "components/form/validation";

@observer
class SendInvoiceModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: null,
            error: null,
            loading: false
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        var { bookingId, type } = UI.modalData;
        this.setState({
            loading: true
        });
        API.post({
            url: type == INVOICE_TYPES.VOUCHER
                    ? API.BOOKING_VOUCHER(bookingId)
                    : API.BOOKING_INVOICE(bookingId),
            body: values,
            success: () => {
                this.setState({
                    success: true,
                    loading: false
                });
            },
            error: () => {
                this.setState({
                    error: true,
                    loading: false
                });
            }
        });
    }

    render() {
        var { t } = useTranslation(),
            { referenceCode, type } = UI.modalData,
            { closeModal } = this.props,
            { error, success, loading } = this.state;

        return (
            <div class="confirm modal">
                {closeModal && <div class="close-button" onClick={closeModal}>
                    <span class="icon icon-close" />
                </div>}

                <h2>{type == INVOICE_TYPES.VOUCHER ? t("Send Voucher") : t("Send Invoice")}</h2>

                { error && <div>{t("An error occured")}</div>}

                { success && <div>{
                                type == INVOICE_TYPES.VOUCHER
                                    ? t("Booking voucher has been sent")
                                    : t("Booking invoice has been sent")
                                }
                </div>}

                { loading && <div>{t("Loading...")}</div>}

                { !error && !success && !loading &&
                    <CachedForm
                        id="SendInvoiceForm"
                        initialValues={{ email: "" }}
                        validationSchema={emailFormValidator}
                        onSubmit={this.submit}
                        render={formik => (
                            <React.Fragment>
                                <div class="form">
                                    <p>
                                        {t("Enter email to receive information about booking")} <br/>
                                        { referenceCode }.
                                    </p>
                                    <div class="row">
                                        <FieldText formik={formik}
                                            id="email"
                                            placeholder={t("Email")}
                                        />
                                    </div>
                                    <div class="bottom">
                                        <button class="button green" type="submit">
                                            {t("Confirm")}
                                        </button>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    />
                }
            </div>
        );
    }
}

export default SendInvoiceModal;
