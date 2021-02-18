import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class ReadOnlyModal extends React.Component {
    render() {
        var { t } = useTranslation(),
            { closeModal } = this.props;

        return (
            <div className="confirm modal">
                {closeModal && <div className="close-button" onClick={closeModal}>
                    <span className="icon icon-close" />
                </div>}

                <h2>{t("We’re verifying your agency")}</h2>
                <div>
                    {t("Thank you for joining us at Happytravel.com. You do not yet have access to the app, but your request has been sent to one of our officers. Once it has been fulfilled, you will receive notification by email.")}
                </div>
            </div>
        );
    }
}

export default ReadOnlyModal;
