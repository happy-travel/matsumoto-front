import React from "react";
import { useTranslation } from "react-i18next";
import { searchRoomsCreate } from "tasks/accommodation/search-rooms-loaders";
import { price } from "simple";
import { HotelStars } from "components/accommodation";
import RoomSummary from "../parts/room-summary";
import { MODALS } from "enum/modals-enum";
import { $view } from "stores";

const AccommodationSearchResultContract = ({ contract }) => {
    const accommodationSelect = () => {
        searchRoomsCreate(contract);
    };

    const { t } = useTranslation();
    return (
        <div className="contract" key={contract.accommodation.id}>
            <div className="summary">
                <div
                    className="photo"
                    onClick={accommodationSelect}
                    style={
                        contract.accommodation.photo.sourceUrl ?
                            { backgroundImage: `url(${contract.accommodation.photo.sourceUrl})`} :
                            null
                    }
                />
                <div className="detail">
                    <div className="upper">
                        <div className="name-and-price">
                            <div className="name" onClick={accommodationSelect}>
                                <div className="address">
                                    {contract.accommodation.location.address}
                                </div>
                                <h2>
                                    {contract.accommodation.name}
                                </h2>
                            </div>
                            <div className="price">
                                <div>{t("From")}</div>
                                {price(contract.roomContractSets?.[0]?.rate.currency, contract.minPrice)}
                            </div>
                        </div>

                        <HotelStars count={contract.accommodation.rating} />

                        <div className="text">
                            { contract.supplier &&
                                <div>
                                    <i>Supplier: {" " + contract.supplier}</i>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="availability" onClick={accommodationSelect}>
                            {
                                t("At least")
                            } {__plural(
                                t,
                                contract.roomContractSets.length > 2 ?
                                    contract.roomContractSets.length-1 :
                                    contract.roomContractSets.length,
                                "option"
                            )} {t("available")}
                        </div>

                        { /* todo: remove legacy
                            <div className="features">
                                <button
                                    className={"button mini-label" + __class(contract.hasDuplicate, "disabled")}
                                    id={contract.supplier + "." + contract.accommodation.id}
                                    onClick={
                                        !contract.hasDuplicate ? () => $view.setModal(MODALS.REPORT_DUPLICATE, contract) : null
                                    }>
                                        {contract.hasDuplicate ? t("Marked as Duplicate") : t("Mark as duplicate")}
                                </button>
                            </div>
                        */ }
                    </div>
                </div>
            </div>
            <div className="rooms">
                { contract.roomContractSets.slice(0, 2).map((roomContractSet, index) =>
                    <RoomSummary
                        key={index}
                        roomContractSet={roomContractSet}
                        onSelect={accommodationSelect}
                        htId={contract.htId}
                    />
                ) }
            </div>
        </div>
    );
};

export default AccommodationSearchResultContract;
