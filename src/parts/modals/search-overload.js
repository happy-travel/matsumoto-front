import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class SearchOverloadModal extends React.Component {
    render() {
        var { t } = useTranslation(),
            { closeModal } = this.props;

        return (
            <div className="confirm modal">
                {closeModal && <div className="close-button" onClick={closeModal}>
                    <span className="icon icon-close" />
                </div>}

                <h2>{t("Would you like an exclusive offer?")}</h2>
                <div>
                    {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                    <br/>
                    <br/>
                    {t("Email")}: <a href="mailto:reservations@happytravel.com" className="link">reservations@happytravel.com</a>
                </div>
            </div>
        );
    }
}

export default SearchOverloadModal;
