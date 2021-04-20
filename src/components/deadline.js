import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date } from "simple";

const Deadline = ({ roomContractSet, searchId, resultId }) => {
    const { t } = useTranslation();

    const [result, setResult] = useState(null);
    const deadline = result?.date || roomContractSet.deadline.date;
    const isRequestPossible = !result;

    const request = (event) => {
        event.stopPropagation();
        API.get({
            url: API.REQUEST_DEADLINE(
                searchId,
                resultId,
                roomContractSet.id
            ),
            success: data => {
                setResult(data || {});
            }
        });
    };

    if (isRequestPossible && roomContractSet.deadline?.isFinal !== true)
        return (
            <div className="deadline">
                <div
                    className="link tag clickable"
                    onClick={request}
                >
                    {t("Cancellation Deadline")} <i className="icon icon-info" />
                </div>
            </div>
        );

    if (deadline) {
        if (!date.passed(deadline))
            return (
                <div className={"deadline future" + __class(!isRequestPossible, "requested")}>
                    {t("Deadline")} – {date.format.a(deadline)}
                </div>
            );
        return (
            <div className={"deadline near" + __class(!isRequestPossible, "requested")}>
                {t("Within deadline")} – {date.format.a(deadline)}
            </div>
        );
    }

    return (
        <div className="deadline free">
            {t("FREE Cancellation - Without Prepayment")}
        </div>
    );
};

export default Deadline;
