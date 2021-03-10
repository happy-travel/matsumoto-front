import React from "react";
import { date } from "simple";

class FullDeadline extends React.Component {
    render() {
        const { deadline = {}, remarks, t } = this.props,
              warnAboutDeadlineIsNear = deadline.date && date.passed(date.addDay(deadline.date, -7));

        return (
            <>
                <div className={"accent-frame information" + __class(warnAboutDeadlineIsNear, "warn", "ok")}>
                    <div className="before">
                        { warnAboutDeadlineIsNear ?
                            <span className="icon icon-warning-yellow" /> :
                            <span className="icon icon-warning-green" /> }
                    </div>
                    <div className="data">
                        {deadline.date ?
                            <b>
                                {t("Cancellation Deadline")}: {date.format.a(deadline.date)}
                            </b>
                        :
                            <span className="info green">
                                {t("FREE Cancellation - Without Prepayment")}
                            </span>
                        }
                        { !!deadline?.policies?.length &&
                            deadline.policies.map((item, index) => (
                                <div key={index}>
                                    {t("From")} {date.format.a(item.fromDate)} {t("cancellation costs")} {item.percentage}% {t("of total amount")}.
                                </div>
                            ))
                        }
                    </div>
                </div>
                { !!remarks && !!remarks.length && <div className="accent-frame information">
                    <div className="before">
                        <i className="icon icon-hotel-information" />
                    </div>
                    <div className="data">
                        <b>{t("Accommodation Information")}</b>
                        { remarks.map(item => (
                            <div key={item.key}>
                                {!!item.key && <span>{item.key}:</span>} {item.value}
                            </div>
                        ))}
                    </div>
                </div> }
            </>
        );
    };
}

export default FullDeadline;