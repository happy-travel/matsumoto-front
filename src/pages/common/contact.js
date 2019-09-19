import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class ContactUsPage extends React.Component {
    render() {
        var { t } = useTranslation();

        return (
            <div class="confirmation block document">
                <section class="double-sections">
                    <div class="right-section">
                        <section>
                            Our Customer Service team is available 24 hours a day, seven days a week.<br/>
                            <br/>
                            Email <a href="mailto:info@happytravel.com" class="link">info@happytravel.com</a><br/>
                            Call +971 4 294 000 7 (UAE)<br/>
                            <br/>
                            Please note, all calls may be recorded for training purposes.<br/>
                            <br/>
                            <br/>
                            <br/>
                            Our Office Address<br/>
                            <br/>
                            HappyTravelDotCom Travel and Tourism LLC<br/>
                            <br/>
                            B106, Saraya Avenue building<br/>
                            <br/>
                            Garhoud, Deira<br/>
                            <br/>
                            P.O. Box 36366<br/>
                            <br/>
                            Dubai, United Arab Emirates<br/>
                        </section>
                    </div>
                </section>
            </div>
        );
    }
}

export default ContactUsPage;