import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import settings from "settings";
import { observer } from "mobx-react";
import LocaleSwitcher from "components/switchers/locale";
import CurrencySwitcher from "components/switchers/currency";

import UI from "stores/ui-store";
import authStore from "stores/auth-store";

@observer
class Footer extends React.Component {
render() {
    const { t } = useTranslation();
    return (
        <footer>
            <div class="upper-part">
                <section>
                    <div class="company">
                        <div class="logo-wrapper">
                            <a href="/" class="logo" />
                        </div>
                        { /* <div class="social">
                            <a href="#">
                                <span class="icon icon-snet-1-f" />
                            </a>
                            <a href="#">
                                <span class="icon icon-snet-2-t" />
                            </a>
                        </div> */ }
                    </div>
                    <div class="links">
                        <menu class="primary">
                            <li><Link to="/">{t("Accommodations")}</Link></li>
                            <li><Link to="/contact">{t("Contact Us")}</Link></li>
                            <li><Link to="/about">{t("About Us")}</Link></li>
                        </menu>
                        <menu class="secondary">
                            <li><Link to="/terms">{t("Terms & Conditions")}</Link></li>
                            <li><Link to="/privacy">{t("Privacy Policy")}</Link></li>
                        </menu>
                        <div class="payments">
                            <img src="/images/other/visa.png" />
                            <img src="/images/other/visa-sec.png" class="interval"/>
                            <img src="/images/other/mc-on-dark.png" class="near transparent" />
                            <img src="/images/other/mc-sec-on-dark.png" class="interval-big transparent" />
                            <img src="/images/other/amex.png" />
                        </div>
                        <div class="service-info">
                            Web – {settings.build || 0}<br/>
                            API – {UI.currentAPIVersion || 0}
                        </div>
                    </div>
                    <div class="switchers">

                        <LocaleSwitcher />
                        { !!authStore.userCache?.access_token && <CurrencySwitcher /> }
                    </div>
                    <div class="contact">
                        <h3>{t("Contact Us")}</h3>
                        <div><span>{t("Email")}:</span> <a href="mailto:info@happytravel.com">info@happytravel.com</a></div>
                        <div><span>{t("Phone")}:</span> +971-4-2999080</div>
                        <div>
                            <span>{t("Address")}:</span> HappyTravelDotCom<br/> Travel and Tourism LLC,<br/>
                            {t("footer_address_line_2")}<br/>
                            {t("footer_address_line_3")}<br/>
                            {t("footer_address_line_4")}<br/>
                            {t("footer_address_line_5")}
                        </div>
                        <div class="license">
                            <span>TRN:</span> 100497287100003
                        </div>
                        <div class="license">
                            <span>IATA: </span> 96-0 4653
                        </div>
                        <div class="license">
                            <span>Trade License: </span> 828719
                        </div>
                    </div>
                </section>
            </div>
            <div class="copyright">
                <section>
                    {t("_copyright")}<br/>
                </section>
            </div>
        </footer>
    );
}}

export default Footer;
