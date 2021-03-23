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
class MarkupsListPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markups: [],
            templates: [],
            isExpanded: false
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
            success: markups => this.setState({
                markups,
                isExpanded: !markups?.length
            })
        });
    }

    remove = (id) => {
        var { agentId } = this.props;
        API.delete({
            url: API.AGENT_MARKUP(agentId, id),
            success: () => this.load()
        });
    }

    create = (values, formik) => {
        var { agentId } = this.props,
            { templates } = this.state,
            amount = values.amount;

        amount = amount.replaceAll(",", ".");

        API.post({
            url: API.AGENT_MARKUPS(agentId),
            body: {
                description: values.description,
                templateId: templates[values.templateIndex].id,
                templateSettings: {
                    [templates[values.templateIndex].parameterNames[0]]: amount
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
        const {
            markups,
            emptyText,
            onRemove
        } = this.props;

        const { t } = useTranslation();

        return (
            <>
                <h2><span className="brand">{t("Markup Management")}</span></h2>
                {!markups?.length && <div style={{ margin: "30px 0 60px" }}>{emptyText}</div>}
                {markups
                    .sort((a,b) => (a.settings.order - b.settings.order))
                    .map((markup, index) => (
                        <div className="markup" key={index}>
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
                            <span className="link" onClick={() => onRemove(markup.id)}>Remove</span>
                        </div>
                    ))}
            </>
        );
    }
}

export default MarkupsListPart;