import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat } from "core";
import UI from "stores/ui-store";
import moment from "moment";

@observer
class CancellationConfirmationModal extends React.Component {

    constructor(props) {
        super(props);
        this.bookingCancel = this.bookingCancel.bind(this);
    }

    bookingCancel() {
        var { bookingId } = UI.modalData;
        this.props.closeModal();
        API.post({
            url: API.BOOKING_CANCEL(bookingId),
            success: () => {
                window.location.reload(); //todo: temporary unsmart decision
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

                <div class="bottom">
                    <button class="button pink" onClick={this.bookingCancel}>
                        {t("Confirm")}
                    </button>
                    <button class="button green" onClick={closeModal}>
                        {t("Decline")}
                    </button>
                </div>
            </React.Fragment>
        }
            </div>
        );
    }
}

export default CancellationConfirmationModal;
