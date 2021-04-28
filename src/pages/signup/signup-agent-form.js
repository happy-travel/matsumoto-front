import React from "react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "components/breadcrumbs";
import { CachedForm, FORM_NAMES } from "components/form";
import { registrationAgentValidator } from "components/form/validation";
import FormAgentData from "parts/form-agent-data";

const SignUpAgentForm = ({ agentWay, initialValues, submit }) => {
    const { t } = useTranslation();
    return (
        <div>
            <Breadcrumbs
                items={[
                    {
                        text: t("Sign In"),
                        link: "/logout"
                    }, {
                        text: t("Registration"),
                        link: "/logout"
                    }, {
                        text: t("Agent Information")
                    }
                ]}
                noBackButton
            />
            <h2>
                Agent Information
            </h2>
            <div className="paragraph">
                Create a free Happytravel.com account and start booking today
            </div>

            <CachedForm
                id={FORM_NAMES.RegistrationAgentForm}
                initialValues={initialValues}
                validationSchema={registrationAgentValidator}
                onSubmit={submit}
                render={(formik) => (
                    <div className="form">
                        <FormAgentData formik={formik} />
                        <div className="row">
                            <div className="field">
                                <div className="inner">
                                    <button type="submit" className="button main">
                                        { agentWay ?
                                            t("Finish Registration") :
                                            t("Continue Registration")
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default SignUpAgentForm;
