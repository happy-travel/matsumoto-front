import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import { ReactComponent as FacebookIcon } from "./images/facebook.svg";
import { ReactComponent as TwitterIcon } from "./images/twitter.svg";

const Footer = () => {
    const { t, i18n } = useTranslation();
    return (
        <footer>
            <div class="upper-part">
                <section>
                    <div class="company">
                        <div class="logo-wrapper">
                            <a href="#" class="logo" />
                        </div>
                        <div class="social">
                            <a href="#">
                                <FacebookIcon />
                            </a>
                            <a href="#">
                                <TwitterIcon />
                            </a>
                        </div>
                    </div>
                    <div class="links">
                        <menu class="primary">
                            <li><a href="#">Accommodation</a></li>
                            <li><a href="#">Transfers</a></li>
                            <li><a href="#">Tours</a></li>
                            <li><a href="#">Visa</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">FAQ</a></li>
                        </menu>
                        <menu class="secondary">
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Police</a></li>
                        </menu>
                    </div>
                    <div class="contact">
                        <h3>Contact Us</h3>
                        <div><span>Email:</span> info@happytravel.com</div>
                        <div><span>Phone:</span> +971-4-2999080</div>
                        <div>
                            <span>Address:</span> HAPPYTRAVELDOTCOM LLC,<br/>
                            B102 Saraya Avenue Bldg,<br/>
                            65th Street, Garhoud<br/>
                            Dubai, United Arab Emirates
                        </div>
                    </div>
                </section>
            </div>
            <div class="copyright">
                <section>
                    Copyright © 2019 Happy Travel. All Rights Reserved.
                </section>
            </div>
        </footer>
    );
};

export default Footer;
