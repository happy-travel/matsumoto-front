import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
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
                            <li><Link to="/">{t("Accommodation")}</Link></li>
                            { /* todo:
                            <li><a href="#">{t("Transfers")}</a></li>
                            <li><a href="#">{t("Tours")}</a></li>
                            <li><a href="#">{t("Visa")}</a></li>
                            <li><a href="#">{t("About")}</a></li>
                            <li><a href="#">{t("FAQ")}</a></li>
                            */ }
                        </menu>
                        <menu class="secondary">
                            <li><Link to="/terms">{t("Terms & Conditions")}</Link></li>
                            <li><Link to="/privacy">{t("Privacy Police")}</Link></li>
                            <li><Link to="/contact">{t("Contact Us")}</Link></li>
                            <li><Link to="/about">{t("About Us")}</Link></li>
                        </menu>
                        <div class="payments">
                            <img src="/images/other/visa.png" />
                            <img src="/images/other/mc-on-dark.png" class="transparent" />
                            <img src="/images/other/visa-sec.png" />
                            <img src="/images/other/mc-sec-on-dark.png" class="transparent" />
                        </div>
                    </div>
                    <div class="contact">
                        <h3>{t("Contact Us")}</h3>
                        <div><span>{t("Email")}:</span> info@happytravel.com</div> { /* todo : links */}
                        <div><span>{t("Phone")}:</span> +971-4-2999080</div>
                        <div>
                            <span>{t("Address")}:</span> {t("footer_address_line_1")}<br/>
                            {t("footer_address_line_2")}<br/>
                            {t("footer_address_line_3")}<br/>
                            {t("footer_address_line_4")}<br/>
                            {t("footer_address_line_5")}
                        </div>
                    </div>
                </section>
            </div>
            <div class="copyright">
                <section>
                    {t("_copyright")}
                </section>
            </div>
        </footer>
    );
};

export default Footer;
