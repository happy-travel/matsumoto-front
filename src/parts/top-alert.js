import React from "react";
import { observer } from "mobx-react";
import UI from "stores/ui-store";

@observer
class TopAlert extends React.Component {
    constructor(props) {
        super(props);
        this.hideAlert = this.hideAlert.bind(this);
    }

    hideAlert() {
        UI.setTopAlertText(null);
    }

    render() {
        if (!UI?.topAlertText)
            return null;

        return (
            <div class="top-alert">
                <section>
                    <span class="icon icon-warning-inverted"/>
                    <div class="inner">
                        {UI?.topAlertText}
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
