import registrationAgentValidator, {
    registrationAgentValidatorWithEmail,
    emailFormValidator,
    registrationAgentValidatorWithEmailAndAgencyName
} from "./validator-registration-agent";
import registrationCompanyValidator from "./validator-registration-company";
import accommodationSearchValidator from "./validator-accommodation-search";
import accommodationBookingValidator from "./validator-accommodation-booking";
import { creditCardValidator, savedCreditCardValidator } from "./validator-credit-card";
import { transferBalanceValidator } from "./transfer-balance-validator";

export {
    registrationAgentValidator,
    registrationAgentValidatorWithEmail,
    registrationAgentValidatorWithEmailAndAgencyName,
    registrationCompanyValidator,
    accommodationSearchValidator,
    accommodationBookingValidator,
    creditCardValidator,
    savedCreditCardValidator,
    emailFormValidator,
    transferBalanceValidator
};
