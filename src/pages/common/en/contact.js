import React from "react";
import { useTranslation } from "react-i18next";

export default function () {
    const { t } = useTranslation();
    return (
        <div class="confirmation block document">
            <section>
                <h1>{t("Contact Us")}</h1>
                Our Customer Service team is available 24 hours a day, seven days a week.<br/>
                <br/>
                Email <a href="mailto:info@happytravel.com" class="link">info@happytravel.com</a><br/>
                Call +971 4 294 000 7 (UAE)<br/>
                <br/>
                Please note, all calls may be recorded for training purposes.<br/>
            </section>
        </div>
    );
};
