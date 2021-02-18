import { API } from "core";
import paymentStore from "stores/payment-store";

export const loadPaymentServiceData = () => API.get({ url: API.DIRECT_LINK_PAY.SETTINGS });

export const loadSavedCards = () => {
    return API.get({
        url: API.CARDS_SAVED,
        success: data => paymentStore.setSavedCards(data)
    })
};

export const removeSavedCard = (cardId) => {
    var { savedCards } = this.state;
    savedCards = savedCards.filter(item => item.id != cardId);
    return API.delete({
        url: API.CARDS_REMOVE(cardId),
        success: () => {
            this.setState({
                savedCards,
                addNew: !savedCards.length
            });
        }
    });
};
