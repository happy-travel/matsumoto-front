import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import settings from "settings";
import { observer } from "mobx-react";
import LocaleSwitcher from "components/complex/locale-switcher";
import CurrencySwitcher from "components/complex/currency-switcher";

import UI from "stores/ui-store";
import { Authorized } from "core/auth";

@observer
class Footer extends React.Component {
render() {
    const { t } = useTranslation();
    var ht = UI.ourCompanyInfo;
    return (
        <footer>
            <div class="upper-part">
                <section>
                    <div class="company">
                        <div class="logo-wrapper">
                            <a href="/" class="logo" />
                        </div>
                        { /* <div class="social">
                            <a href="https://facebook.com/HappyTraveldotcom/" target="_blank">
                                <span class="icon icon-snet-1-f" />
                            </a>
                            <a href="#">
                                <span class="icon icon-snet-2-t" />
                            </a>
                        </div> */ }
                    </div>
                    <div class="middle">
                        <div class="links">
                            <menu>
                                <li><Link to="/">{t("Accommodations")}</Link></li>
                                <li><Link to="/contact">{t("Contact Us")}</Link></li>
                                <li><Link to="/about">{t("About Us")}</Link></li>
                            </menu>
                            <menu>
                                <li><Link to="/terms">{t("Terms & Conditions")}</Link></li>
                                <li><Link to="/privacy">{t("Privacy Policy")}</Link></li>
                            </menu>
                            <div class="payments">
                                <img src="/images/other/mc-on-dark.png" class="near transparent" alt="Mastercard" />
                                <img src="/images/other/mc-sec-on-dark.png" class="interval-big transparent" alt="Mastercard Id Check" />
                                <img src="/images/other/visa.png" alt="Visa" />
                                <img src="/images/other/visa-sec.png" class="interval" alt="Visa Secure" />
                                <img src="/images/other/amex.png" alt="American Express" />
                            </div>
                            <div class="service-info">
                                Web – {settings.build || 0}<br/>
                                API – {UI.currentAPIVersion || 0}
                            </div>
                        </div>
                        <div class="switchers">
                            <LocaleSwitcher />
                            { Authorized() && <CurrencySwitcher /> }
                        </div>
                    </div>
                    <div class="contact">
                        <h3>{t("Contact Us")}</h3>
                        <div><span>{t("Email")}:</span> <a href={`mailto:${ht.email}}`}>{ht.email}</a></div>
                        <div><span>{t("Phone")}:</span> {ht.phone}</div>
                        <div>
                            <span>{t("Address")}:</span> {ht.name}<br/>
                            {ht.address}<br/>
                            P.O. {ht.postalCode}<br/>
                            {ht.city}, {ht.country}
                        </div>
                        <div class="license">
                            <span>TRN:</span> {ht.trn}
                        </div>
                        <div class="license">
                            <span>IATA: </span> {ht.iata}
                        </div>
                        <div class="license">
                            <span>Trade License: </span> {ht.tradeLicense}
                        </div>
                    </div>
                </section>
            </div>
            <div class="copyright">
                <section>
                    {t("_copyright")} © 2019 — {new Date().getFullYear()} {ht.name} <br/>
                </section>
            </div>
        </footer>
    );
}}

export default Footer;
