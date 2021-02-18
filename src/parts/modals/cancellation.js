import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { dateFormat, price, Loader } from "simple";
import View from "stores/view-store";
import store from "stores/accommodation-store";

@observer
class CancellationConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            penalty: null,
            loading: false
        };
    }

    componentDidMount() {
        var { bookingId } = View.modalData;
        API.get({
            url: API.BOOKING_PENALTY(bookingId),
            success: (penalty) => this.setState({ penalty })
        });
    }

    bookingCancel = () => {
        var { bookingId } = View.modalData;
        this.setState({ loading: true });
        API.post({
            url: API.BOOKING_CANCEL(bookingId),
            success: () => {
                window.location.reload();
            },
            error: () => this.setState({ loading: false })
        });
    };

    render() {
        var { t } = useTranslation(),
            { bookingDetails } = View.modalData,
            { closeModal } = this.props,
            { penalty, loading } = this.state;

        return (
    <div className="confirm modal">
        { loading &&
            <Loader page />
        }

        { closeModal &&
            <div className="close-button" onClick={closeModal}>
                <span className="icon icon-close" />
            </div>
        }

        { !moment().isBefore(bookingDetails.checkInDate) ?
            <>

                <h2>{t("Cancellation Deadline")}</h2>
                <p>
                    {t("Cancellation is not possible furthermore, Check In date passed")}.
                </p>

            </>
        :
            <>
                <h2>{t("Are you sure you want to cancel your booking?")}</h2>
                <p>
                    {t("You are about to cancel your booking")} {bookingDetails.referenceCode}
                </p>

                { moment().isAfter(bookingDetails.deadlineDate) &&
                    <>
                        <p>
                            {t("Cancellation Deadline")} {dateFormat.a(bookingDetails.deadlineDate)} {t("has passed. A cancellation fee will be charged according to accommodation's cancellation policy.")}
                        </p>
                        <p className="danger">
                            { penalty?.amount ?
                                <>
                                    {t("Cancellation cost")}: {price(penalty)}
                                </> :
                                <br />
                            }
                        </p>
                    </>}

                { !moment().isAfter(bookingDetails.deadlineDate) &&
                    <p className="green">
                        {t("FREE Cancellation - Without Prepayment")}
                    </p>
                }

                <div className="bottom">
                    <button
                        className={"button" + __class(!moment().isAfter(bookingDetails.deadlineDate), "green")}
                        onClick={this.bookingCancel}
                    >
                        {t("Cancel booking")}
                    </button>
                </div>
            </>
        }
    </div>
        );
    }
}

export default CancellationConfirmationModal;
