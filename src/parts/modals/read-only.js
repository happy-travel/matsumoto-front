import React from "react";
import { useTranslation } from "react-i18next";

const ReadOnlyModal = ({ closeModal }) => {
    const { t } = useTranslation();

    return (
        <div className="confirm modal">
            <div className="close-button" onClick={closeModal}>
                <span className="icon icon-close" />
            </div>

            <h2>{t("We’re verifying your agency")}</h2>
            <div>
                {t("Thank you for joining us at Happytravel.com. You do not yet have access to the app, but your request has been sent to one of our officers. Once it has been fulfilled, you will receive notification by email.")}
            </div>
        </div>
    );
};

export default ReadOnlyModal;
