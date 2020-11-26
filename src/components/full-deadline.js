import React from "react";
import { dateFormat } from "simple";
import moment from "moment";

class FullDeadline extends React.Component {
    render() {
        var { deadline = {}, remarks, t } = this.props,
            warnAboutDeadlineIsNear = false;

        if (deadline.date) {
            if (moment().add(7, "d").isAfter(deadline.date))
                warnAboutDeadlineIsNear = true;
        }

        return (
            <React.Fragment>
                <div class={"accent-frame information" + __class(warnAboutDeadlineIsNear, "warn", "ok")}>
                    <div class="before">
                        { warnAboutDeadlineIsNear ?
                            <span class="icon icon-warning-yellow" /> :
                            <span class="icon icon-warning-green" /> }
                    </div>
                    <div class="data">
                        {deadline.date ?
                            <b>
                                {t("Cancellation Deadline")}: {dateFormat.a(deadline.date)}
                            </b>
                        :
                            <span className="info green">
                                {t("FREE Cancellation - Without Prepayment")}
                            </span>
                        }
                        {!!deadline?.policies?.length && deadline.policies.map(item => (<div>
                            {t("From")} {dateFormat.a(item.fromDate)} {t("cancellation costs")} {item.percentage}% {t("of total amount")}.
                        </div>))}
                    </div>
                </div>
                { !!remarks && !!remarks.length && <div class="accent-frame information">
                    <div class="before">
                        <i class="icon icon-hotel-information" />
                    </div>
                    <div class="data">
                        <b>{t("Accommodation Information")}</b>
                        { remarks.map(item => (
                            <div>
                                {!!item.key && <span>{item.key}:</span>} {item.value}
                            </div>
                        ))}
                    </div>
                </div> }
            </React.Fragment>
        );
    };
}

export default FullDeadline;