import moment from "moment";
import React from "react";
import { dateFormat, API } from "core";

class Deadline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null
        };
        this.request = this.request.bind(this);
    }

    request() {
        API.get({
            url: API.REQUEST_DEADLINE(
                this.props.availabilityId,
                this.props.source,
                this.props.agreement.id,
            ),
            success: data => {
                this.setState({
                    result: data?.data || {}
                });
            }
        });
    }

    render() {
        var { agreement, t, source } = this.props,
            date = this.state.result?.date || agreement.deadlineDate,
            isRequestPossible = ((2 == source) && !this.state.result);

        /* if (!date && isRequestPossible)
            return (
                <div class="info">
                    <div
                        class="link"
                        onClick={this.request}
                    >
                        {t("Cancellation Deadline")} <i class="icon icon-info" />
                    </div>
                </div>
            ); */

        if (date) {
            if (moment().isBefore(date))
                return (
                    <div class="info green">
                        {t("Deadline")} – {dateFormat.a(date)}
                    </div>
                );
            return (
                <div class="info warning">
                    {t("Within deadline")} – {dateFormat.a(date)}
                </div>
            );
        }

        return (
            <div class="info green">
                {t("FREE Cancellation - Without Prepayment")}
            </div>
        );
    };
}

export default Deadline;