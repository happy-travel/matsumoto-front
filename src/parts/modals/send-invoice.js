import React from "react";
import { API } from "core";
import { INVOICE_TYPES } from "enum";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { emailFormValidator } from "components/form/validation";
import { $ui, $view } from "stores";

@observer
class SendInvoiceModal extends React.Component {
    state = {
        success: null,
        error: null,
        loading: false,
        booking: {}
    };

    componentDidMount() {
        API.get({
            url: API.BOOKING_GET_BY_ID($view.modalData.bookingId),
            success: booking => this.setState({ booking })
        });
    }

    submit = (values) => {
        var { bookingId, type } = $view.modalData;
        this.setState({
            loading: true
        });
        API.post({
            url: type == INVOICE_TYPES.VOUCHER
                    ? API.BOOKING_VOUCHER_SEND(bookingId)
                    : API.BOOKING_INVOICE_SEND(bookingId),
            body: values,
            success: () => {
                this.setState({
                    success: true,
                    loading: false
                });
                $ui.dropFormCache(FORM_NAMES.SendInvoiceForm);
            },
            error: () => {
                this.setState({
                    error: true,
                    loading: false
                });
            }
        });
    };

    render() {
        var { t } = useTranslation(),
            { type } = $view.modalData,
            { closeModal } = this.props,
            { error, success, loading, booking } = this.state;

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
                        onSubmit={this.submit}
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
    }
}

export default SendInvoiceModal;
