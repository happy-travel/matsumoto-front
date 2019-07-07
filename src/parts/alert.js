import React from 'react';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Link } from "react-router-dom";

@observer
class Alert extends React.Component {
    render() {
        const { t, i18n } = useTranslation();
        return <React.Fragment />;

        return (
            <div class="header-alert">
                <section>
                    <span class="icon icon-warning-inverted"/>
                    Text of an alert
                    <button class="button transparent">
                        Verify your account
                    </button>
                </section>
            </div>
        );
    }
}

export default Alert;
