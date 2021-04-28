import CachedForm from "./cached-form";
import FieldText from "./field-text";
import FieldSwitch from "./field-switch";
import FieldCheckbox from "./field-checkbox";
import FieldTextarea from "./field-textarea";
import FieldRange from "./field-range";
import FieldSelect from "./field-select/field-select";
import FieldDatepicker from "./field-datepicker/field-datepicker";

const FORM_NAMES = {
    CreateInviteForm: "CreateInviteForm",
    RegistrationAgentForm: "RegistrationAgentForm",
    RegistrationCompanyForm: "RegistrationCompanyForm",
    SearchForm: "SearchForm",
    BookingForm: "BookingForm",
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
    FieldDatepicker,

    FORM_NAMES
};
