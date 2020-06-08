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
            <div class="top-alert">
                <section>
                    <span class="icon icon-warning-white"/>
                    <div class="inner">
                        {View?.topAlertText}
                    </div>
                    <div class="close-button" onClick={this.hideAlert}>
                        <span class="icon icon-close white" />
                    </div>
                    {/* <button class="button transparent">
                        Verify your account
                    </button> */}
                </section>
            </div>
        );
    }
}

export default TopAlert;
