import React from 'react';
import { observer } from "mobx-react";

import CancellationConfirmationModal from "parts/modals/cancellation";
import SendInvoiceModal from "parts/modals/send-invoice";
import SearchOverloadModal from "parts/modals/search-overload";
import ReportDuplicateModal from "parts/modals/duplicate";
import ReadOnlyModal from "parts/modals/read-only";

import UI, { MODALS } from "stores/ui-store";

const modalComponent = {
    [MODALS.CANCELLATION_CONFIRMATION]: CancellationConfirmationModal,
    [MODALS.SEND_INVOICE]: SendInvoiceModal,
    [MODALS.SEARCH_OVERLOAD]: SearchOverloadModal,
    [MODALS.REPORT_DUPLICATE]: ReportDuplicateModal,
    [MODALS.READ_ONLY]: ReadOnlyModal
};

@observer
class Index extends React.Component {
    closeModal = () => UI.setModal(null)

    render() {
        var Content = modalComponent[UI.modal];

        if (!Content)
            return null;

        return (
            <div class="modal-wrapper">
                <div class="overlay" onClick={this.closeModal} />
                <div class="modal-scroll">
                    <Content
                        closeModal={this.closeModal}
                    />
                </div>
            </div>
        );
    }
}

export default Index;
