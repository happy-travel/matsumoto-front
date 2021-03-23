import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import {
    CachedForm,
    FieldText,
    FieldSelect
} from "components/form";

@observer
class MarkupFormPart extends React.Component {
    render() {
        const {
            templates,
            onSubmit
        } = this.props;

        const { t } = useTranslation();
        return (
            <>
                <h3>Add Markup</h3>

                <CachedForm
                    enableReinitialize
                    onSubmit={onSubmit}
                    initialValues={{
                        templateIndex: 0
                    }}
                    render={formik => (
                        <div className="form">
                            <div className="row">
                                <FieldSelect
                                    formik={formik}
                                    id="templateIndex"
                                    label="Markup Type"
                                    options={
                                        templates.map((template, index) => (
                                            {value: index, text: template.title}
                                        ))
                                    }
                                />
                            </div>
                            <div className="row">
                                <FieldText
                                    formik={formik}
                                    id="order"
                                    label="Order"
                                    maxLength={4}
                                    numeric
                                />
                            </div>
                            <div className="row">
                                <FieldText
                                    formik={formik}
                                    id="description"
                                    label="Description"
                                    placeholder="Description"
                                />
                            </div>
                            <div className="row">
                                <FieldText
                                    formik={formik}
                                    id="amount"
                                    label="Amount"
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="row">
                                <div className="field">
                                    <div className="inner">
                                        <button type="submit" className="button">
                                            {t("Create Markup")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </>
        );
    }
}

export default MarkupFormPart;