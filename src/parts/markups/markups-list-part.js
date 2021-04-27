import React from "react";
import { useTranslation } from "react-i18next";

const MarkupsListPart = ({ markups, emptyText, onRemove }) => {
    const { t } = useTranslation();
    return (
        <>
            <h2>{t("Markup Management")}</h2>

            {!markups?.length && <div style={{ margin: "30px 0 0" }}>{emptyText}</div>}
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
};

export default MarkupsListPart;