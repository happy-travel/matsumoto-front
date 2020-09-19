import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { dateFormat } from "simple";
import { Redirect } from "react-router-dom";
import UI from "stores/ui-store";
import store from "stores/accommodation-store";

@observer
class CancellationConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
        this.bookingCancel = this.bookingCancel.bind(this);
    }

    bookingCancel() {
        var { bookingId } = UI.modalData;
        API.post({
            url: API.BOOKING_CANCEL(bookingId),
            success: () => {
                this.props.closeModal();
                window.scrollTo(0, 0);
                store.setBookingResult(null);
                API.get({
                    url: API.BOOKING_GET_BY_ID(bookingId),
                    after: (result, err, data) => store.setBookingResult(result || {}, data, err)
                });
            }
        });
    }

    render() {
        var { t } = useTranslation(),
            data = UI.modalData,
            { closeModal } = this.props;

        return (
            <div class="confirm modal">
                {closeModal && <div class="close-button" onClick={closeModal}>
                    <span class="icon icon-close" />
                </div>}

        { !moment().isBefore(data.checkInDate) ?
            <React.Fragment>

                <h2>{t("Cancellation Deadline")}</h2>
                <p>
                    {t("Cancellation is not possible furthermore, out of deadline")}.
                </p>

            </React.Fragment>
        :
            <React.Fragment>
                <h2>{t("Are you sure want to cancel booking?")}</h2>
                <p>
                    {t("You are about to cancel your booking")} {data.referenceCode}.
                </p>

                { moment().isAfter(data.deadline) &&
                <p class="danger">
                    {t("Cancellation Deadline")} {dateFormat.a(data.deadline)} {t("has passed. A cancellation fee will be charged according to accommodation's cancellation policy.")}
                </p> }

                { !moment().isAfter(data.deadline) &&
                <p class="green">
                    {t("FREE Cancellation - Without Prepayment")}
                </p> }

                <div class="bottom">
                    <button
                        class={"button" + __class(!moment().isAfter(data.deadline), "green")}
                        onClick={this.bookingCancel}
                    >
                        {t("Cancel booking")}
                    </button>
                </div>
            </React.Fragment>
        }
            </div>
        );
    }
}

export default CancellationConfirmationModal;
