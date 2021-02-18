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
            <div className="upper-part">
                <section>
                    <div className="company">
                        <div className="logo-wrapper">
                            <a href="/" className="logo" />
                        </div>
                        { /* <div className="social">
                            <a href="https://facebook.com/HappyTraveldotcom/" target="_blank">
                                <span className="icon icon-snet-1-f" />
                            </a>
                            <a href="#">
                                <span className="icon icon-snet-2-t" />
                            </a>
                        </div> */ }
                    </div>
                    <div className="middle">
                        <div className="links">
                            <menu>
                                <li><Link to="/">{t("Accommodations")}</Link></li>
                                <li><Link to="/contact">{t("Contact Us")}</Link></li>
                                <li><Link to="/about">{t("About Us")}</Link></li>
                            </menu>
                            <menu>
                                <li><Link to="/terms">{t("Terms & Conditions")}</Link></li>
                                <li><Link to="/privacy">{t("Privacy Policy")}</Link></li>
                            </menu>
                            <div className="payments">
                                <img src="/images/other/mc-on-dark.png" className="near transparent" alt="Mastercard" />
                                <img src="/images/other/mc-sec-on-dark.png" className="interval-big transparent" alt="Mastercard Id Check" />
                                <img src="/images/other/visa.png" alt="Visa" />
                                <img src="/images/other/visa-sec.png" className="interval" alt="Visa Secure" />
                                <img src="/images/other/amex.png" alt="American Express" />
                            </div>
                            <div className="service-info">
                                Web – {settings.build || 0}<br/>
                                API – {UI.currentAPIVersion || 0}
                            </div>
                        </div>
                        <div className="switchers">
                            <LocaleSwitcher />
                            { Authorized() && <CurrencySwitcher /> }
                        </div>
                    </div>
                    <div className="contact">
                        <h3>{t("Contact Us")}</h3>
                        <div><span>{t("Email")}:</span> <a href={`mailto:${ht.email}`}>{ht.email}</a></div>
                        <div><span>{t("Phone")}:</span> {ht.phone}</div>
                        <div>
                            <span>{t("Address")}:</span> {ht.name}<br/>
                            {ht.address}<br/>
                            P.O. {ht.postalCode}<br/>
                            {ht.city}, {ht.country}
                        </div>
                        <div className="license">
                            <span>TRN:</span> {ht.trn}
                        </div>
                        <div className="license">
                            <span>IATA: </span> {ht.iata}
                        </div>
                        <div className="license">
                            <span>Trade License: </span> {ht.tradeLicense}
                        </div>
                    </div>
                </section>
            </div>
            <div className="copyright">
                <section>
                    {t("_copyright")} © 2019 — {new Date().getFullYear()} {ht.name} <br/>
                </section>
            </div>
        </footer>
    );
}}

export default Footer;
