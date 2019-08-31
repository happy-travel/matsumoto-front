import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FieldText, FieldSelect } from "components/form";
import { registrationUserValidator } from "components/form/validation";

@observer
class ErrorPage extends React.Component {
    render() {
        var { t } = useTranslation();

        return (
            <div class="error-page account block sign-up-page">
                <section>
                    <div class="logo-wrapper">
                        <Link to="/" class="logo" />
                    </div>
                    <div class="middle-section">
                        <div class="picture">
                            <div class="text">
                         BACK TO LOGIN       <h1>404</h1>
                                <h2>{t("Page not found")}</h2>
                            </div>
                        </div>

                        <Link to="/">
                            <span class="button">
                                {t("Back to login")}
                            </span>
                        </Link>
                    </div>
                </section>
            </div>
        );
    }
}

export default ErrorPage;