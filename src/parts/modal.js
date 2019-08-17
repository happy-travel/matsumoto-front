import React from 'react';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';

@observer
class Modal extends React.Component {
    render() {
        const { t, i18n } = useTranslation();
        return null;

        return (
            <div class="modal-wrapper">
                <div class="overlay">
                </div>
                <div class="modal">
                    <div class="title">
                        Confirm E-mail Change
                    </div>
                    <div class="content">
                        Code from E-mail
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
