import React from "react";
import { useTranslation } from "react-i18next";

export default function () {
    const { t } = useTranslation();
    return (
        <div className="confirmation block document">
            <section>
                <h1>{t("Contacts")}</h1>
                Our Customer Service team is available 24 hours a day, seven days a week.<br/>
                <br/>
                Email <a href="mailto:info@happytravel.com" className="link">info@happytravel.com</a><br/>
                Call +971 4 294 000 7 (UAE)<br/>
                <br/>
                Please note, all calls may be recorded for training purposes.<br/>
                <h2>Our Office Addresses</h2>

                <h3>United Arab Emirates</h3>
                <p>B102, Saraya Avenue building, Dubai</p>
                <h3>Russia</h3>
                <p>2, Enthusiastov boulevard, Moscow</p>
                <h3>Saudi Arabia</h3>
                <p>2659, Al Daeiri Al Shamali, Al Riyadh</p>
            </section>
        </div>
    );
};
