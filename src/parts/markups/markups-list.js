import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";

@observer
class MarkupsListPart extends React.Component {
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