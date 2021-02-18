import moment from "moment";
import React from "react";
import { API } from "core";
import { dateFormat } from "simple";

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
                this.props.searchId,
                this.props.resultId,
                this.props.roomContractSet.id
            ),
            success: data => {
                this.setState({
                    result: data || {}
                });
            }
        });
    }

    render() {
        var { roomContractSet, t, searchId, resultId } = this.props,
            date = this.state.result?.date || roomContractSet.deadline.date,
            isRequestPossible = !this.state.result;

        if (isRequestPossible && roomContractSet.deadline?.isFinal !== true)
            return (
                <div className="info">
                    <div
                        className="link"
                        onClick={this.request}
                    >
                        {t("Cancellation Deadline")} <i className="icon icon-info" />
                    </div>
                </div>
            );

        if (date) {
            if (moment().isBefore(date))
                return (
                    <div className="info green">
                        {t("Deadline")} – {dateFormat.a(date)}
                    </div>
                );
            return (
                <div className="info warning">
                    {t("Within deadline")} – {dateFormat.a(date)}
                </div>
            );
        }

        return (
            <div className="info green">
                {t("FREE Cancellation - Without Prepayment")}
            </div>
        );
    };
}

export default Deadline;
