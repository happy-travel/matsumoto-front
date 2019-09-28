import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class PrivacyPolicyPage extends React.Component {
    render() {
        var { t } = useTranslation();

        return (
            <div class="confirmation block document">
                <section class="double-sections">
                    <div class="right-section">
<section>

    <h1>Privacy policy outlining the use of personal data</h1>
        <p>This website is owned and run by HappyTravelDotCom Travel and Tourism LLC (HappyTravelDotCom). The term “our online services” refers to happytravel.com, our pages on third party social media platforms such as Instagram, Facebook, Twitter, and any other websites or apps we run. The term “our services” refers to our online services and any of our other products and services. If you use any of our services, we will refer to you using the terms “user”, “visitor”, “you”, “your”, “yours” in this policy.</p>
        <p>We respect the privacy rights of our visitors and recognise the importance of protecting the information collected about them. This privacy policy is about how we collect, store, and use the personal information that you provide to us. As part of our commitment to your privacy rights and security.</p>
        <ul>
            <li>All credit/debit cards details and personally identifiable information will NOT be stored, sold, shared, rented or leased to any third parties.</li>
            <li>The Website Policies and Terms & Conditions may be changed or updated occasionally to meet the requirements and standards. Therefore the Customers’ are encouraged to frequently visit these sections in order to be updated about the changes on the website. Modifications will be effective on the day they are posted.</li>
            <li>Some of the advertisements you see on the Site are selected and delivered by third parties, such as ad networks, advertising agencies, advertisers, and audience segment providers. These third parties may collect information about you and your online activities, either on the Site or on other websites, through cookies, web beacons, and other technologies in an effort to understand your interests and deliver to you advertisements that are tailored to your interests. Please remember that we do not have access to, or control over, the information these third parties may collect. The information practices of these third parties are not covered by this privacy policy.</li>
        </ul>
    <h2>Registration</h2>
        <p>To use some of the services or features made available to you on this website you will need to register. When you register, you must provide information about yourself that is true, accurate, current, and complete in all respects. Should any of your registration information change, please notify us immediately at the following e-mail address admin@happytravel.com. We may also change registration requirements from time to time.</p>
        <p>The account password you provide should be unique and kept secure, and you must notify HappyTravelDotCom immediately of any breach of security or unauthorized use of your account.</p>
        <p>What kind of personal information does HappyTravelDotCom collect?</p>
        <p>When you make a reservation, you will be asked for your name, address, telephone number, email address, payment details, number of passengers and confirmation number for payment sent from HappyTravelDotCom team.</p>
        <p>You cannot make a booking without registering an account. This allows you to save your personal settings, and manage future reservations.</p>
        <p><b>When you visit our website we will collect:</b></p>
        <ul>
            <li>IP address</li>
            <li>Browser used</li>
            <li>Operating system of your computer</li>
            <li>Language</li>
            <li>Pages you have been visited</li>
        </ul>
        <p>HappyTravelDotCom receives an information when you use social media services.</p>
        <h2>Does HappyTravelDotCom share your information with third-party?</h2>
        <p><i>Competent Authorities:</i> We disclose personal data to law enforcement and other governmental authorities insofar as it is required by law or is strictly necessary for the prevention, detection or prosecution of criminal acts and fraud.</p>
        <p><i>Business Partners:</i> When you make a reservation on one of our business partners’ websites, certain personal data that you give them will be forwarded to HappyTravelDotCom. Certain business partners may receive your personal data from us if requested by you. When you make a reservation on a business partners’ website, read the privacy policies on these business partners’ websites for more information.</p>

</section>
                    </div>
                </section>
            </div>
        );
    }
}

export default PrivacyPolicyPage;