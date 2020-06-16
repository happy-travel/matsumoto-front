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
                <br/>
                <br/>
                <br/>
                <h2>Our Office Address</h2>
                <p>
                    HappyTravelDotCom Travel and Tourism LLC,<br/>
                    {t('footer_address_line_2')}<br/>
                    {t('footer_address_line_3')}<br/>
                    {t('footer_address_line_4')}<br/>
                    {t('footer_address_line_5')}
                </p>
            </section>
        </div>
    );
};
