import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader } from "components/simple";
import { registrationAgentValidator } from "components/form/validation";
import { CachedForm } from "components/form";
import FormAgentData from "parts/form-agent-data";
import { $personal } from "stores";

@observer
class AgentInformation extends React.Component {
    state = {
        loading: false
    };

    submitAgentData = (values) => {
        this.setState({ loading: true });
        API.put({
            url: API.AGENT_PROPERTIES,
            body: values,
            success: (result) => {
                $personal.setInformation({
                    ...$personal.information,
                    ...result
                });
            },
            after: () => this.setState({ loading: false })
        });
    };

    render() {
        const { t } = useTranslation();
        return (
            <>
                {this.state.loading && <Loader page />}

                <h2>{t("Personal Information")}</h2>

                <CachedForm
                    onSubmit={this.submitAgentData}
                    validationSchema={registrationAgentValidator}
                    initialValues={$personal.information}
                    enableReinitialize
                    render={formik => (
                        <div className="form agent-data">
                            <FormAgentData formik={formik} />
                            <div className="row controls">
                                <div className="field">
                                    <div className="inner">
                                        <button type="submit" className={"button" +
                                        __class(!formik.isValid || !formik.dirty, "disabled")}>
                                            {t("Save changes")}
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

export default AgentInformation;
