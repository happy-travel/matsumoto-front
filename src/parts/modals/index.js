import React from "react";
import { observer } from "mobx-react";

import CancellationConfirmationModal from "parts/modals/cancellation";
import SendInvoiceModal from "parts/modals/send-invoice";
import SearchOverloadModal from "parts/modals/search-overload";
import ReportDuplicateModal from "parts/modals/duplicate";
import ReadOnlyModal from "parts/modals/read-only";

import View, { MODALS } from "stores/view-store";

const modalComponent = {
    [MODALS.CANCELLATION_CONFIRMATION]: CancellationConfirmationModal,
    [MODALS.SEND_INVOICE]: SendInvoiceModal,
    [MODALS.SEARCH_OVERLOAD]: SearchOverloadModal,
    [MODALS.REPORT_DUPLICATE]: ReportDuplicateModal,
    [MODALS.READ_ONLY]: ReadOnlyModal
};

@observer
class Index extends React.Component {
    closeModal = () => View.setModal(null);

    render() {
        var Content = modalComponent[View.modal];

        if (!Content)
            return null;

        return (
            <div className="modal-wrapper">
                <div className="overlay" onClick={this.closeModal} />
                <div className="modal-scroll">
                    <Content
                        closeModal={this.closeModal}
                    />
                </div>
            </div>
        );
    }
}

export default Index;
