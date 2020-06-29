import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class ErrorPage extends React.Component {
    componentDidMount() {
        document.querySelectorAll("header, footer").forEach(
            item => item ? item.style.display = "none" : null
        );
    }

    render() {
        var { t } = useTranslation();

        return (
            <div class="error-page account block sign-up-page">
                <section>
                    <div class="logo-wrapper">
                        <a href="/" class="logo" />
                    </div>
                    <div class="middle-section">
                        <div class="picture">
                            <div class="text">
                                <h1>404</h1>
                                <h2>{t("Page not found")}</h2>
                            </div>
                        </div>

                        <a href="/">
                            <span class="button">
                                {t("Back to homepage")}
                            </span>
                        </a>
                    </div>
                </section>
            </div>
        );
    }
}

export default ErrorPage;