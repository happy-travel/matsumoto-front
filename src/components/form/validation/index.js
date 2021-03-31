import registrationUserValidator, {
    registrationUserValidatorWithEmail,
    emailFormValidator,
    registrationUserValidatorWithEmailAndAgencyName
} from "./validator-registration-agent";
import registrationCounterpartyValidator from "./validator-registration-counterparty";
import accommodationSearchValidator from "./validator-accommodation-search";
import accommodationBookingValidator from "./validator-accommodation-booking";
import { creditCardValidator, savedCreditCardValidator } from "./validator-credit-card";
import { transferBalanceValidator } from "./transfer-balance-validator";

export {
    registrationUserValidator,
    registrationUserValidatorWithEmail,
    registrationUserValidatorWithEmailAndAgencyName,
    registrationCounterpartyValidator,
    accommodationSearchValidator,
    accommodationBookingValidator,
    creditCardValidator,
    savedCreditCardValidator,
    emailFormValidator,
    transferBalanceValidator
};
