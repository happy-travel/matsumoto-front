import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";

import { Loader } from "simple";
import { registrationUserValidator } from "components/form/validation";
import { CachedForm } from "components/form";
import FormUserData from "parts/form-user-data";

import authStore from "stores/auth-store";

@observer
class UserInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };

        this.submitUserData = this.submitUserData.bind(this);
    }

    submitUserData(values) {
        this.setState({ loading: true });
        API.put({
            url: API.AGENT_PROPERTIES,
            body: values,
            success: (result) => {
                authStore.setUser({
                    ...authStore.user,
                    ...result
                });
            },
            after: () => this.setState({ loading: false })
        });
    }

    render() {
        const { t } = useTranslation();
        return (
            <>
                {this.state.loading && <Loader page />}

                <h2><span class="brand">{t("Personal Information")}</span></h2>

                <CachedForm
                    onSubmit={this.submitUserData}
                    validationSchema={registrationUserValidator}
                    initialValues={authStore.user}
                    enableReinitialize
                    render={formik => (
                        <div class="form user-data">
                            <FormUserData formik={formik} t={t} />
                            <div class="row controls">
                                <div class="field">
                                    <div class="inner">
                                        <button type="submit" class={"button" +
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

export default UserInformation;
