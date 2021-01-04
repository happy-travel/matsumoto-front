import React from 'react';
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader, dateFormat, price } from "simple";

import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

const remapStatus = (status = "") => status.replace(/([A-Z])/g, " $1").trim();

@observer
class AccommodationConfirmationInvoicePage extends React.Component {
    componentDidMount() {
        API.get({
            url: API.BOOKING_INVOICE(this.props.match?.params?.id),
            success: invoice => this.setState({ invoice })
        });
    }

    showSendModal = () => {
        UI.setModal(
            MODALS.SEND_INVOICE,
            {
                type: INVOICE_TYPES.INVOICE,
                bookingId: this.props.match?.params?.id
            }
        );
    }

    render() {
        var { t } = useTranslation(),
            invoice = this?.state?.invoice,
            registration = invoice?.item1,
            data = invoice?.item2;

        document.title = (registration?.number || "") + " Invoice Happytravel.com";

        if (!invoice)
            return <Loader />;

        return (
            <div class="invoice">
                <div class="breadcrumbs no-print">
                    <Link to={`/accommodation/confirmation/${this.props.match?.params?.id}`}>
                        <span class="small-arrow-left" /> Back to Booking Confirmation
                    </Link>
                </div>
                <div class="buttons no-print">
                    <button class="button" onClick={window.print}>{t("Print")}</button>
                    <button class="button" onClick={this.showSendModal}>{t("Send Invoice")}</button>
                </div>

                <h4>
                    <strong>PROFORMA INVOICE</strong><br/>
                    {registration.number}<br/>
                    {dateFormat.e(registration.date)}
                </h4>
                <div class="details">
                    <div>Bill to: {data.buyerDetails.name}</div>
                    <div>Address: {data.buyerDetails.address}</div>
                    {!!data.buyerDetails.contactPhone &&
                        <div>Contact phone: {data.buyerDetails.contactPhone}</div>
                    }
                    {data.buyerDetails.email &&
                        <div>Email: <a href={`mailto:${data.buyerDetails.email}`}>{data.buyerDetails.email}</a></div>
                    }
                </div>

                <div class="details">
                    <div>Booking Reference number: {data.referenceCode}</div>
                    <div>Arrival Date: {dateFormat.e(data.checkInDate)}</div>
                    <div>Departure Date: {dateFormat.e(data.checkOutDate)}</div>
                    <div>Deadline Date: {dateFormat.e(data.deadlineDate)}</div>
                </div>

                <div>
                    <table class="data">
                        <thead>
                            <tr>
                                <th>Leading passenger</th>
                                <th>Accommodation</th>
                                <th>Room</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.invoiceItems?.map((item, index) => (
                                <tr>
                                    <td>
                                        {item.mainPassengerFirstName} {item.mainPassengerLastName}
                                    </td>
                                    <td>{item.accommodationName}</td>
                                    <td>
                                        {item.roomDescription}<br/>
                                        {item.roomType}
                                    </td>
                                    <td>{item.number}</td>
                                    <td>{price(item.price)}</td>
                                    <td>{price(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div class="total">
                        <div>TOTAL:</div>
                        <div>{price(data.totalPrice)} ({remapStatus(data.paymentStatus)})</div>
                    </div>
                </div>

                <div class="signature">
                    <img src="/images/other/signature.png" alt="Signature" />
                </div>

                <div class="details">
                    <div>PAYMENT DUE DATE: {dateFormat.e(data.payDueDate)}</div>
                </div>

                <div class="details">
                    <h5>BANK ACCOUNT DETAILS:</h5>
                    <div>{data.sellerDetails.companyName}</div>
                    <div>Bank Name: {data.sellerDetails.bankName}</div>
                    <div>SWIFT: {data.sellerDetails.swiftCode}</div>
                    <div>Routing Code: {data.sellerDetails.routingCode}</div>
                    <div>Bank Address: {data.sellerDetails.bankAddress}</div>
                    <div>IBAN: {data.sellerDetails.iban}</div>
                    <div>Account No.: {data.sellerDetails.accountNumber}</div>
                </div>

                <div class="details">
                    <div>
                        <strong>
                            Note:<br/>
                            Please note that the remitter must bear all bank charges including corresponding bank commission.
                            Please send the bank transfer swift copy/payment details to <a href="mailto:accounts@happytravel.com">accounts@happytravel.com</a>
                        </strong>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccommodationConfirmationInvoicePage;
