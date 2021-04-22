import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BasicHeader from "parts/header/basic-header";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.querySelectorAll("header, footer").forEach(
            item => item ? item.style.display = "none" : null
        );
        setTimeout(() => {
            document.title = "Happytravel.com";
        }, 0);
        return () => {
            document.querySelectorAll("header, footer").forEach(
                item => item ? item.style.display = "block" : null
            );
        }
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

                    <Link to="/">
                        <span className="button">
                            {t("Back to") + " " + t("Homepage")}
                        </span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default NotFoundPage;