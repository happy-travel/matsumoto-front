import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class SearchOverloadModal extends React.Component {
    render() {
        var { t } = useTranslation(),
            { closeModal } = this.props;

        return (
            <div class="confirm modal">
                {closeModal && <div class="close-button" onClick={closeModal}>
                    <span class="icon icon-close" />
                </div>}

                <h2>{t("Would you like an exclusive offer?")}</h2>
                <div>
                    {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                    <br/>
                    <br/>
                    {t("Email")}: <a href="mailto:reservations@happytravel.com" class="link">reservations@happytravel.com</a>
                </div>
            </div>
        );
    }
}

export default SearchOverloadModal;
