import React from 'react';
import { observer } from "mobx-react";
import UI, { MODALS } from "stores/ui-store";

import AccommodationDetailsModal from "pages/accommodation/details-modal";
import CancellationConfirmationModal from "parts/cancellation";

const modalComponent = {
    [MODALS.ACCOMMODATION_DETAILS]: AccommodationDetailsModal,
    [MODALS.CANCELLATION_CONFIRMATION]: CancellationConfirmationModal
};

const closeModal = () => UI.setModal(null);

@observer
class Modal extends React.Component {
    render() {
        var Content = modalComponent[UI.modal],
            {
                hideCloseButton = false
            } = this.props;

        if (!Content)
            return null;

        return (
            <div class="modal-wrapper">
                <div class="overlay" onClick={closeModal} />
                <div class="modal-scroll">
                    <Content
                        closeModal={closeModal}
                    />
                </div>
            </div>
        );
    }
}

export default Modal;
