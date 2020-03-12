import React from "react";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, dateFormat } from "core";
import { emailFormValidator } from "components/form/validation";

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
                    {t("Email")}: <a href="mailto:info@happytravel.com" class="link">info@happytravel.com</a>
                </div>
            </div>
        );
    }
}

export default SearchOverloadModal;
