import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import {
    CachedForm,
    FieldText,
    FieldSelect
} from "components/form";
import { API } from "core";

import authStore from "stores/auth-store";

@observer
class AgentMarkup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markups: [],
            templates: []
        }
    }

    componentDidMount() {
        if (!authStore.permitted("MarkupManagement"))
            return null;

        API.get({
            url: API.MARKUP_TEMPLATES,
            success: templates => this.setState({ templates })
        });
        this.load();
    }

    load = () => {
        var { agentId } = this.props;
        API.get({
            url: API.AGENT_MARKUPS(agentId),
            success: markups => this.setState({ markups })
        });
    }

    remove = (id) => {
        var { agentId } = this.props;
        API.delete({
            url: API.AGENT_MARKUP(agentId, id),
            success: () =>  this.load()
        });
    }

    create = (values, formik) => {
        var { agentId } = this.props,
            { templates } = this.state;
        API.post({
            url: API.AGENT_MARKUPS(agentId),
            body: {
                description: values.description,
                templateId: templates[values.templateIndex].id,
                templateSettings: {
                    [templates[values.templateIndex].parameterNames[0]]: values.amount
                },
                order: values.order,
                currency: "USD"
            },
            success: () => {
                this.load();
                formik.resetForm();
            }
        });
    }

    render() {
        if (!authStore.permitted("MarkupManagement"))
            return null;

        var { t } = useTranslation(),
            { markups, templates } = this.state;

        return (
            <div class="markup-management">
                <h2><span class="brand">{t("Markup Management")}</span></h2>
                {!markups?.length && <div style={{ margin: "30px 0 60px" }}>Agent has no markups</div>}
                {markups
                    .sort((a,b) => (a.settings.order - b.settings.order))
                    .map((markup, index) => (
                    <div class="markup">
                        <div>
                            <i>{index + 1}.</i>{" "}
                            <strong>
                                { markup.settings.templateSettings.factor ?
                                    "x " + markup.settings.templateSettings.factor :
                                    "+ " + markup.settings.templateSettings.addition + " USD" }
                            </strong>{" "}
                            ({markup.settings.description}){" "}
                            <i>#{markup.settings.order}</i>
                        </div>
                        <span class="link" onClick={() => this.remove(markup.id)}>Remove</span>
                    </div>
                ))}
                <h3>Add Markup</h3>

                <CachedForm
                    enableReinitialize
                    onSubmit={this.create}
                    initialValues={{
                        templateIndex: 0
                    }}
                    render={formik => (
                        <div class="form">
                            <FieldSelect formik={formik}
                                         id="templateIndex"
                                         label="Markup Type"
                                         options={
                                             templates.map((template, index) => (
                                                 {value: index, text: template.title}
                                             ))
                                         }
                            />
                            <FieldText formik={formik}
                                       id="order"
                                       label="Order"
                                       maxLength={4}
                                       numeric
                            />
                            <FieldText formik={formik}
                                       id="description"
                                       label="Description"
                                       placeholder="Description"
                            />
                            <FieldText formik={formik}
                                       id="amount"
                                       label="Amount"
                                       placeholder="Amount"
                            />
                            <div class="row submit-holder">
                                <div class="field">
                                    <div class="inner">
                                        <button type="submit" class="button">
                                            {t("Create Markup")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        );
    }
}

export default AgentMarkup;