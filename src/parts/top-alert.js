import React from "react";
import { observer } from "mobx-react";
import View from "stores/view-store";

@observer
class TopAlert extends React.Component {
    constructor(props) {
        super(props);
        this.hideAlert = this.hideAlert.bind(this);
    }

    hideAlert() {
        View.setTopAlertText(null);
    }

    render() {
        if (!View?.topAlertText)
            return null;

        return (
            <div className="top-alert">
                <section>
                    <span className="icon icon-warning-white"/>
                    <div className="inner">
                        {View?.topAlertText}
                    </div>
                    <div className="close-button" onClick={this.hideAlert}>
                        <span className="icon icon-close white" />
                    </div>
                    {/* <button className="button transparent">
                        Verify your account
                    </button> */}
                </section>
            </div>
        );
    }
}

export default TopAlert;
