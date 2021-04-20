import React, { useEffect } from "react";
import BasicHeader from "parts/header/basic-header";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.querySelectorAll("header, footer").forEach(
            item => item ? item.style.display = "none" : null
        );
    }, []);

    return (
        <div className="error-page block">
            <BasicHeader />
            <section>
                <div>
                    <div className="picture">
                        <div className="text">
                            <h1>404</h1>
                            <h2>{t("Page not found")}</h2>
                        </div>
                    </div>

                    <a href="/">
                        <span className="button">
                            {t("Back to") + " " + t("Homepage")}
                        </span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ErrorPage;