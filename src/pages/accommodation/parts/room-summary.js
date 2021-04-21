import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { GroupRoomTypesAndCount, price } from "simple";
import { MealPlan } from "components/accommodation";
import Deadline from "components/deadline";
import { APR_VALUES } from "enum";
import { $accommodation, $personal } from "stores";

const RoomSummary = observer(({ resultId, roomContractSet, onSelect, secondStep }) => {
    const isRestricted = roomContractSet.isAdvancePurchaseRate && ($personal.agencyAPR <= APR_VALUES.DisplayOnly);

    const { t } = useTranslation();
    return (
        <div
            className={"room" + __class(isRestricted && secondStep, "disabled")}
            onClick={isRestricted && secondStep ? null : onSelect}
        >
            <div className="info">
                <h3>
                    <GroupRoomTypesAndCount contracts={roomContractSet.rooms} />
                </h3>
                {roomContractSet.supplier &&
                    <div>
                        <i>Supplier: {" " + roomContractSet.supplier}</i>
                    </div>
                }
                <div>
                    <MealPlan room={roomContractSet.rooms[0]} />
                </div>
                { !roomContractSet.isAdvancePurchaseRate &&
                    <Deadline
                        searchId={$accommodation.search.id}
                        resultId={resultId}
                        roomContractSet={roomContractSet}
                    />
                }
                <div>
                    { (isRestricted && !secondStep) &&
                        <div className="tag">
                            {t("Restricted Rate")}
                        </div>
                    }
                    { roomContractSet.isDirectContract &&
                        <div className="tag">
                            {t("Direct Connectivity")}
                        </div>
                    }
                    { roomContractSet.rooms[0]?.isDynamic === true &&
                        <div className="tag">
                            {t("Dynamic offer")}
                        </div>
                    }
                </div>
            </div>
            <div className="price">
                {price(roomContractSet.rate.finalPrice)}
            </div>
            <div className="button-holder">
                {(isRestricted && secondStep) ?
                    <strong>
                        {t("Restricted Rate")}
                    </strong> :
                    <div className="button-wrapper">
                        <span className="hide">{isRestricted ? t("Restricted Rate") : t("Choose option")}</span>
                        <button className="button small main" onClick={onSelect}>
                            <i className="icon icon-arrow-next" />
                        </button>
                    </div>
                 }
            </div>
        </div>
    );
});

export default RoomSummary;
