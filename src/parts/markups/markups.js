import React from "react";
import { observer } from "mobx-react";
import { API } from "core";
import MarkupFormPart from "parts/markups/markup-form-part";
import MarkupsListPart from "parts/markups/markups-list-part";

@observer
class Markups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markups: [],
            templates: [],
            isExpanded: false
        }
    }

    componentDidMount() {
        API.get({
            url: API.MARKUP_TEMPLATES,
            success: templates => this.setState({ templates })
        });
        this.load();
    }

    load = () => {
        let { markupsRoute, id } = this.props;
        API.get({
            url: markupsRoute(id),
            success: markups => this.setState({
                markups,
                isExpanded: !markups?.length
            })
        });
    };

    remove = (markupId) => {
        let { markupRoute, id } = this.props;
        API.delete({
            url: markupRoute(id, markupId),
            success: () => this.load()
        });
    };

    create = (values, formik) => {
        let { markupsRoute, id } = this.props,
            { templates } = this.state,
            amount = values.amount;

        amount = amount.replaceAll(",", ".");

        API.post({
            url: markupsRoute(id),
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
    };

    render() {
        const { markups, templates } = this.state,
            { emptyText } = this.props;

        return (
            <div className="markup-management">
                <MarkupsListPart
                    emptyText={emptyText}
                    markups={markups}
                    onRemove={this.remove}
                />
                {!this.state.isExpanded ?
                    <button
                        className="button"
                        onClick={() => this.setState({ isExpanded: true })}
                        style={{ padding: "0 25px", margin: "20px 0 0" }}
                    >
                        Add Markup
                    </button>
                :
                    <MarkupFormPart
                        templates={templates}
                        onSubmit={this.create}
                    />
                }
            </div>
        );
    }
}

export default Markups;