import React from "react";
import { dateFormat } from "core";

class FullDeadline extends React.Component {
    render() {
        var { deadlineDetails, t } = this.props;

        return (
            <React.Fragment>
                <p className="remark">
                    {deadlineDetails.date ?
                        <span>
                            {t("Cancellation Deadline")}: {dateFormat.a(deadlineDetails.date)}
                        </span> :
                        <span className="info green">
                            {t("FREE Cancellation - Without Prepayment")}
                        </span>
                    }
                </p>

                { !!deadlineDetails?.policies?.length && <p class="remark">
                    {deadlineDetails.policies.map(item => (<React.Fragment>
                        {t("From")} {dateFormat.a(item.fromDate)} {t("cancellation costs")} {item.percentage}% {t("of total amount")}.<br/>
                    </React.Fragment>))}
                </p> }
            </React.Fragment>
        );
    };
}

export default FullDeadline;