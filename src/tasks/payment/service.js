import { API } from "core";
import { $payment } from "stores";

export const loadPaymentServiceData = () => API.get({ url: API.DIRECT_LINK_PAY.SETTINGS });

export const loadSavedCards = () => {
    return API.get({
        url: API.CARDS_SAVED,
        success: data => $payment.setSavedCards(data)
    })
};

export const removeSavedCard = (cardId) => {
    let savedCards = $payment.savedCards;
    savedCards = savedCards.filter(item => item.id != cardId);
    return API.delete({
        url: API.CARDS_REMOVE(cardId),
        success: () => {
            $payment.setSavedCards(savedCards);
        }
    });
};
