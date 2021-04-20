import React from "react";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation();
    return (
        <div className="document block">
            <section>
                <h1>Contacts</h1>
                <p>Our Customer Service team is available 24 hours a day, seven days a week.</p>
                <p>Email <a href="mailto:info@happytravel.com" className="link">info@happytravel.com</a></p>
                <p>Call +971 4 294 000 7 (UAE)</p>
                <p>Please note, all calls may be recorded for training purposes.</p>
            </section>
            <section className="offices">
                <h1>Our Office Addresses</h1>
                <div className="list">
                    <div>
                        <h2>United Arab Emirates</h2>
                        <p>B102, Saraya Avenue building, Dubai</p>
                    </div>
                    <div>
                        <h2>Russia</h2>
                        <p>2, Enthusiastov boulevard, Moscow</p>
                    </div>
                    <div>
                        <h2>Saudi Arabia</h2>
                        <p>2659, Al Daeiri Al Shamali, Al Riyadh</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
