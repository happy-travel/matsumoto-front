import React from 'react';
import { observer } from "mobx-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader, dateFormat } from "simple";
import Map from "components/map";

import UI, { MODALS, INVOICE_TYPES } from "stores/ui-store";

@observer
class AccommodationConfirmationVoucherPage extends React.Component {
    componentDidMount() {
        API.get({
            url: API.BOOKING_VOUCHER(this.props.match?.params?.id),
            success: voucher => this.setState({ voucher })
        });
    }

    showSendModal = () => {
        UI.setModal(
            MODALS.SEND_INVOICE,
            {
                type: INVOICE_TYPES.VOUCHER,
                bookingId: this.props.match?.params?.id
            }
        );
    }

    render() {
        var { t } = useTranslation(),
            voucher = this?.state?.voucher;

        document.title = (voucher?.referenceCode || "") + " Voucher Happytravel.com";

        if (!voucher)
            return <Loader />;

        return (
            <div class="invoice">
                <div class="breadcrumbs no-print">
                    <Link to={`/accommodation/confirmation/${voucher.bookingId}`}>
                        <span class="small-arrow-left" /> Back to Booking Confirmation
                    </Link>
                </div>
                <div class="buttons no-print">
                    <button class="button" onClick={window.print}>{t("Print")}</button>
                    <button class="button" onClick={this.showSendModal}>{t("Send Voucher")}</button>
                </div>

                {voucher.logoUrl &&
                    <div class="personal-logo">
                        <img src={voucher.logoUrl} alt="" />
                    </div>
                }

                <div class="information">
                    <div>Thank you{voucher.agentName ? ", " + voucher.agentName : ""}</div>
                </div>
                <div class="information">
                    <div>We look forward to welcoming you at</div>
                    <div>{voucher.accommodation.name}</div>
                    <div>
                        {voucher.accommodation.location.address},{" "}
                        {voucher.accommodation.location.locality},{" "}
                        {voucher.accommodation.location.country}
                    </div>
                </div>
                <div class="information">
                    <div>Booking reference code: {voucher.referenceCode}</div>
                </div>

                <div class="box">
                    <div class="title">Information About Your Stay</div>
                    <div class="columns">
                        <div class="one">
                            <div class="text">{voucher.accommodation.name}</div>
                            <div>
                                {voucher.accommodation.location.address},{" "}
                                {voucher.accommodation.location.locality},{" "}
                                {voucher.accommodation.location.country},{" "}
                                {voucher.accommodation.contactInfo.phones.join(", ")}
                            </div>

                            <div class="text">Length of stay:</div>
                            <div>{__plural(t, voucher.nightCount, "Night")}</div>

                            <div class="text">Arrival Date:</div>
                            <div>{dateFormat.c(voucher.checkInDate)}</div>

                            <div class="text">Departure Date:</div>
                            <div>{dateFormat.c(voucher.checkOutDate)}</div>

                            <div class="text">Deadline Date:</div>
                            <div>{dateFormat.c(voucher.deadlineDate)}</div>

                            { !!voucher.roomDetails?.length && <>
                                <div class="text">Rooms Number:</div>
                                <div>{__plural(t, voucher.roomDetails.length, "Room")}</div>
                            </> }
                        </div>
                        <div class="two">
                            <Map
                                marker={voucher.accommodation.location.coordinates}
                            />
                        </div>
                    </div>
                </div>

                {voucher.bannerUrl &&
                    <div class="personal-b">
                        <img src={voucher.bannerUrl} alt="" />
                    </div>
                }

                {!voucher.deadlineDate &&
                    <div class="deadline-notify">
                        <span class="icon icon-info-green"/>
                        FREE Cancellation
                    </div>
                }
                {moment().isBefore(voucher.deadlineDate) &&
                    <div class="deadline-notify">
                        <span class="icon icon-info-green"/>
                        FREE Cancellation until {dateFormat.c(voucher.deadlineDate)}
                    </div>
                }
            </div>
        )
    }
}

export default AccommodationConfirmationVoucherPage;
