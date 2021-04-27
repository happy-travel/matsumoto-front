import React, { useEffect, useState } from "react";
import { API } from "core";
import MarkupFormPart from "parts/markups/markup-form-part";
import MarkupsListPart from "parts/markups/markups-list-part";

const Markups = ({ markupsRoute, id, emptyText }) => {
    const [markups, setMarkups] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const load = () => {
        API.get({
            url: markupsRoute(id),
            success: (result) => {
                setMarkups(result);
                setIsExpanded(!result?.length);
            }
        });
    };

    useEffect(() => {
        API.get({
            url: API.MARKUP_TEMPLATES,
            success: setTemplates
        });
        load();
    }, []);


    const remove = (markupId) => {
        API.delete({
            url: markupRoute(id, markupId),
            success: load
        });
    };

    const create = (values, formik) => {
        const amount = values.amount.replaceAll(",", ".");
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
                load();
                formik.resetForm();
            }
        });
    };


    return (
        <div className="markup-management">
            <MarkupsListPart
                emptyText={emptyText}
                markups={markups}
                onRemove={remove}
            />
            {!isExpanded ?
                <button
                    className="button"
                    onClick={() => setIsExpanded(true)}
                    style={{ padding: "0 25px", margin: "20px 0 0" }}
                >
                    Add Markup
                </button> :
                <MarkupFormPart
                    templates={templates}
                    onSubmit={create}
                />
            }
        </div>
    );
};

export default Markups;