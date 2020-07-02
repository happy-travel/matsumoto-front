import CachedForm from "./cached-form";
import FieldText from "./field-text";
import FieldSwitch from "./field-switch";
import FieldCheckbox from "./field-checkbox";
import FieldTextarea from "./field-textarea";
import FieldRange from "./field-range";
import FieldSelect from "./field-select";

const FORM_NAMES = {
    CreateInviteForm: "CreateInviteForm",
    AccommodationFiltersForm: "AccommodationFiltersForm",
    RegistrationCounterpartyForm: "RegistrationCounterpartyForm",
    SearchForm: "SearchForm",
    BookingForm: "BookingForm", //todo: google token can be expired, need a validation in future
    SendInvoiceForm: "SendInvoiceForm"
};

export {
    CachedForm,
    FieldText,
    FieldSwitch,
    FieldCheckbox,
    FieldTextarea,
    FieldRange,
    FieldSelect,

    FORM_NAMES
};
