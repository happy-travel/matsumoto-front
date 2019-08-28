import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import UI from "stores/ui-store";

@observer
class TopAlert extends React.Component {
    render() {
        const { t, i18n } = useTranslation();

        if (!UI?.topAlertText)
            return null;

        return (
            <div class="header-alert">
                <section>
                    <span class="icon icon-warning-inverted"/>
                    {UI?.topAlertText}
                    {/* <button class="button transparent">
                        Verify your account
                    </button> */}
                </section>
            </div>
        );
    }
}

export default TopAlert;
