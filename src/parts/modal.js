import React from 'react';
import { observer } from "mobx-react";

import CancellationConfirmationModal from "parts/cancellation";
import SendInvoiceModal from "parts/send-invoice";
import SearchOverloadModal from "parts/search/search-overload";
import ReportDuplicateModal from "parts/duplicate";

import UI, { MODALS } from "stores/ui-store";

const modalComponent = {
    [MODALS.CANCELLATION_CONFIRMATION]: CancellationConfirmationModal,
    [MODALS.SEND_INVOICE]: SendInvoiceModal,
    [MODALS.SEARCH_OVERLOAD]: SearchOverloadModal,
    [MODALS.REPORT_DUPLICATE]: ReportDuplicateModal
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
