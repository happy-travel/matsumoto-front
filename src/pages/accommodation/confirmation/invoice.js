import React from 'react';
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader, dateFormat, price } from "simple";

import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

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

        if (!invoice)
            return <Loader />;

        return (
            <div class="invoice">
                <div class="buttons no-print">
                    <button class="button" onClick={window.print}>{t("Print")}</button>
                    <button class="button" onClick={this.showSendModal}>{t("Send Invoice")}</button>
                </div>

                <h4>Final invoice for {dateFormat.c(registration.date)}</h4>
                <div class="dual">
                    <div class="details">
                        <h5>From</h5>
                         <div>{data.sellerDetails.companyName}</div>
                         <div>Bank Name: {data.sellerDetails.bankName}</div>
                         <div>Bank Address: {data.sellerDetails.bankAddress}</div>
                         <div>Account: {data.sellerDetails.accountNumber}</div>
                         <div>IBAN: {data.sellerDetails.iban}</div>
                         <div>Routing Code: {data.sellerDetails.routingCode}</div>
                         <div>Swift Code: {data.sellerDetails.swiftCode}</div>
                    </div>
                    <div class="details">
                        <h5>Details</h5>
                        <div>Invoice number: {registration.number}</div>
                        <div>Date of issue: {dateFormat.a(registration.date)}</div>
                    </div>
                    <div class="details">
                        <h5>For</h5>
                        <div>{data.buyerDetails.address}</div>
                        <div>{data.buyerDetails.name}</div>
                        {data.buyerDetails.email &&
                            <div><a href={`mailto:${data.buyerDetails.email}`}>{data.buyerDetails.email}</a></div>
                        }
                        {!!data.buyerDetails.contactPhone &&
                            <div>{data.buyerDetails.contactPhone}</div>
                        }
                    </div>
                </div>
                <div>
                    <h4>Purchase Summary</h4>

                    <table class="data">
                        <thead>
                            <tr>
                                <th>#</th>
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
                                    <td>{index+1}</td>
                                    <td>{item.accommodationName}</td>
                                    <td>{item.roomDescription}</td>
                                    <td>{item.number}</td>
                                    <td>{price(item.price)}</td>
                                    <td>{price(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div class="total">
                        <div>Total:</div>
                        <div>{price(data.totalPrice)}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccommodationConfirmationInvoicePage;
