import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { CachedForm } from "components/form";
import FieldAccommodation from "components/complex/field-accommodation";
import * as Yup from "yup";
import View from "stores/view-store";

export const duplicateFormValidator = Yup.object().shape({
    name: Yup.string().required("*"),
    id: Yup.string().required("*"),
});

@observer
class ReportDuplicateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null
        };
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        var id = View.modalData?.accommodation?.id,
            supplier = View.modalData?.supplier;

        if (!id)
            return;

        API.post({
            url: API.REPORT_DUPLICATE,
            body: {
                "accommodation": {
                    "supplier": supplier,
                    "id": id
                },
                "duplicates": [
                    {
                        "supplier": values.source,
                        "id": values.id
                    },
                ]
            },
            success: () => {
                var temporary_duplicate_element = document.getElementById(supplier + "." + id);
                if (temporary_duplicate_element) {
                    temporary_duplicate_element.innerHTML = "Marked as Duplicate";
                    temporary_duplicate_element.className = "button mini-label gray";
                }
            }
        });

        this.props.closeModal();
    }

    render() {
        var { t } = useTranslation(),
            data = View.modalData,
            { closeModal } = this.props;

        return (
            <div class="confirm modal extra-height">
                { closeModal &&
                    <div class="close-button" onClick={closeModal}>
                        <span class="icon icon-close" />
                    </div>
                }

                <h2>Mark the accommodation as a duplicate</h2>
                <p style={{marginBottom: "20px"}}>
                    If you have seen “{data?.accommodation?.name || ""}“ previously in the current accommodations list,
                    you could link it with a duplicate one, and we will join both results to show them as one next time.
                </p>
                <CachedForm
                    onSubmit={this.submit}
                    validationSchema={duplicateFormValidator}
                    render={formik => (
                        <div class="form">
                            <FieldAccommodation
                                formik={formik}
                                id="name"
                                label={t("Accommodation Name")}
                                clearable
                            />
                            <button type="submit" class="button" style={{ marginTop: "20px" }}>
                                {t("Confirm")}
                            </button>
                        </div>
                    )}
                />
            </div>
        );
    }
}

export default ReportDuplicateModal;
