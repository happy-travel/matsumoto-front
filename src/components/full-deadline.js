import React from "react";
import { dateFormat } from "core";
import moment from "moment";

class FullDeadline extends React.Component {
    render() {
        var { deadlineDetails = {}, remarks, t } = this.props,
            warnAboutDeadlineIsNear = false;

        if (deadlineDetails.date) {
            if (moment().add(7, "d").isAfter(deadlineDetails.date))
                warnAboutDeadlineIsNear = true;
        }

        return (
            <React.Fragment>
                <div class={"accent-frame information" + (warnAboutDeadlineIsNear ? " warn" : " ok")}>
                    <div class="before">
                        { warnAboutDeadlineIsNear ?
                            <span class="icon icon-warning-yellow" /> :
                            <span class="icon icon-warning-green" /> }
                    </div>
                    <div class="data">
                        {deadlineDetails.date ?
                            <b>
                                {t("Cancellation Deadline")}: {dateFormat.a(deadlineDetails.date)}
                            </b>
                        :
                            <span className="info green">
                                {t("FREE Cancellation - Without Prepayment")}
                            </span>
                        }
                        { !!deadlineDetails?.policies?.length && deadlineDetails.policies.map(item => (<div>
                            {t("From")} {dateFormat.a(item.fromDate)} {t("cancellation costs")} {item.percentage}% {t("of total amount")}.
                        </div>))}
                    </div>
                </div>
                { !!remarks && !!remarks.length && <div class="accent-frame information">
                    <div class="before">
                        <i class="icon icon-hotel-information" />
                    </div>
                    <div class="data">
                        <b>{t("Hotel Information")}</b>
                        { remarks.map(item => (
                            <div>
                                {item.key ? <span>{item.key}:</span> : ""} {item.value}
                            </div>
                        ))}
                    </div>
                </div> }
            </React.Fragment>
        );
    };
}

export default FullDeadline;