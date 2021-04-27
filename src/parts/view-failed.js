import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ViewFailed = observer(({ reason, button, link }) => {
    const { t } = useTranslation();

    return (
        <div className="error-page inside">
            <div>
                <div className="text">
                    <h1>{t("Oops! Something went wrong!")}</h1>
                    <p>{reason}</p>
                </div>

                {!!button && <Link to={link}>
                    <span className="button">
                        {button}
                    </span>
                </Link> }
            </div>
        </div>
    );
});

export default ViewFailed;