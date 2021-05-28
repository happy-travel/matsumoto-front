import React from "react";
import { useTranslation } from "react-i18next";
import { date } from "simple";
import { MealPlan } from "components/accommodation";

const Allotment = ({ room, contract }) => {
    const { remarks } = room;
    let deadline = room.deadline || room.deadlineDetails;
    const warnAboutDeadlineIsNear = deadline?.date && date.isPast(date.addDay(deadline.date, -7));

    const { t } = useTranslation();
    return (
        <ul className="allotment">
            { !contract.isAdvancePurchaseRate ?
                <li className={__class(warnAboutDeadlineIsNear, "warning", "important")}>
                    <div className="primary">
                        { deadline.date ?
                            t("Cancellation Deadline") + ": " + date.format.a(deadline.date) :
                            t("FREE Cancellation - Without Prepayment")
                        }
                    </div>
                    { !!deadline?.policies?.length &&
                        <div className="additional">
                            { deadline.policies.map((item, index) => (
                                <div key={index}>
                                    {t("From")} {date.format.a(item.fromDate)} {t("cancellation costs")} {item.percentage}% {t("of total amount")}.
                                </div>
                            ))}
                        </div>
                    }
                </li> :
                <li className="warning">
                    <div className="primary">
                        <div className="primary">{t("Within deadline")}</div>
                        <div className="additional">{t("Restricted rate")}</div>
                    </div>
                </li>
            }
            <li className="warn">
                <div className="primary">{t("Board Basis")}</div>
                <div className="additional">
                    <MealPlan room={room} />
                </div>
            </li>
            { remarks?.map((item, index) => (
                <li key={index}>
                    { !!item.key &&
                        <div className="primary">
                            {item.key}
                        </div>
                    }
                    <div className="additional">
                        {item.value}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default Allotment;