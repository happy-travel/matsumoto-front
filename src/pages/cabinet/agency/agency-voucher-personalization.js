import React from "react";
import { API } from "core";
import { useTranslation } from "react-i18next";
import VoucherImage from "./voucher-image";

const AgencyVoucherPersonalization = () => {
    const { t } = useTranslation();
    return (
        <div className="cabinet block">
            <section>
                <h2>{t("Voucher Personalisation")}</h2>
                <div>
                    <VoucherImage
                        route={API.AGENCY_LOGO}
                        title={t("Logo")}
                        text="Recommended size: 226 x 114 pixels"
                    />
                    <VoucherImage
                        route={API.AGENCY_BANNER}
                        title={t("Banner")}
                        text="Recommended size: 726 x 111 pixels"
                    />
                </div>
            </section>
        </div>
    );
};

export default AgencyVoucherPersonalization;
