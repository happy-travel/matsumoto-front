import React from "react";
import { API } from "core";
import { date } from "simple";

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
            deadline = this.state.result?.date || roomContractSet.deadline.date,
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

        if (deadline) {
            if (!date.passed(deadline))
                return (
                    <div className="info green">
                        {t("Deadline")} – {date.format.a(deadline)}
                    </div>
                );
            return (
                <div className="info warning">
                    {t("Within deadline")} – {date.format.a(deadline)}
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
