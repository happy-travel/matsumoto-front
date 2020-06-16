import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import AccommodationCommonDetails from "parts/accommodation-details";

import UI from "stores/ui-store";

@observer
class AccommodationDetailsModal extends React.Component {
    render() {
        var { t } = useTranslation(),
            hotel = UI.modalData,
            { closeModal } = this.props;

        if (!hotel || !hotel.id)
            return null;

        return (
            <div class="details modal">
                {closeModal && <div class="close-button" onClick={closeModal}>
                    <span class="icon icon-close" />
                </div>}
                <div class="title">
                    <h2>
                        {t("Accommodation Details")}
                    </h2>
                </div>
                <div class="content">
                    <AccommodationCommonDetails
                        accommodation={hotel}
                        fromModal
                    />
                    { /*
                    <div class="pdf-button-holder">
                        <button class="button">
                            <div class="image">
                                {t("Create PDF")}
                            </div>
                        </button>
                    </div>
                    */ }
                </div>
            </div>
        );
    }
}

export default AccommodationDetailsModal;
