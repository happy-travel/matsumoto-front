import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API, redirect } from "core";
import { GroupRoomTypesAndCount, MealPlan, Loader, PassengersCount, dateFormat, price } from "simple";
import Breadcrumbs from "components/breadcrumbs";
import Deadline from "components/deadline";
import AccommodationCommonDetails from "parts/accommodation-details";
import store from 'stores/accommodation-store';
import Notifications from "stores/notifications-store";
import authStore, { APR_VALUES } from "stores/auth-store";

@observer
class AccommodationRoomContractsSetsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    back() {
        redirect("/search");
    }

    componentDidMount() {
        window.scrollTo(0, 400);
    }

    showSearch() {
        window.scrollTo(0, 0);
    }

    roomContractSetSelect = (roomContractSet) => {
        this.setState({
            loading: true
        });
        API.get({
            url: API.A_SEARCH_STEP_THREE(
                store.search.id,
                store.selected.accommodation.id,
                roomContractSet.id
            ),
            success: (result) => {
                if (!result?.availabilityId) {
                    Notifications.addNotification("Sorry, this room is not available now, try again later");
                    return;
                }
                store.selectRoomContractSet(result, roomContractSet);
                redirect("/accommodation/booking");
            },
            after: () => {
                this.setState({
                    loading: false
                });
            }
        });
    };

    render() {
        const { t } = useTranslation(),
            item = store.selected.accommodation;

        if (store.secondStepState === null)
            return <Loader />;

        const details = store.selected.accommodationFullDetails || item?.accommodation;

        if (!details)
            return null;

        return (
<div className="search-results block room-contract-sets">
    <section className="double-sections">
        <div className="left-section filters">
            <div className="billet">
                <div className="line">
                    {t("Like, but are you not sure?")}
                </div>
                <button className="button small" onClick={this.back}>
                    {t("Similar accommodations")}
                </button>
            </div>
        </div>
        <div className="right-section">
            <div className="title">
                <Breadcrumbs items={[
                    {
                        text: t("Search Accommodations"),
                        link: "/"
                    }, {
                        text: store.search.request?.destination,
                        link: "/search"
                    }, {
                        text: details.name
                    }
                ]}
                    backLink="/search"
                />
            </div>
            { this.state.loading && <Loader page /> }

            <AccommodationCommonDetails accommodation={details} />

            <h2>{t("Room Availability")}</h2>

            <div className="billet">
                <div className="part">
                    <div className="subpart">
                        <div className="h1">{t("Check In Date")}</div>
                        <div className="h2">{dateFormat.d(store.search.request.checkInDate)}</div>
                        { details?.schedule?.checkInTime &&
                          <div className="h3">{t("From")} {details.schedule.checkInTime}</div> }
                    </div>
                    <div className="subpart">
                        <div className="h1">{t("Check Out Date")}</div>
                        <div className="h2">{dateFormat.d(store.search.request.checkOutDate)}</div>
                        <div className="h3">{__plural(t, store.search?.numberOfNights, "Night")}</div>
                    </div>
                    <div className="subpart">
                        <div className="h1">{t("Guests")}</div>
                        <div className="h2"><PassengersCount t={t} adults={store.search.request.adultsTotal} /></div>
                        <div className="h2"><PassengersCount t={t} children={store.search.request.childrenTotal} /></div>
                    </div>
                </div>
                <div className="part">
                    <button className="button small" onClick={this.showSearch}>
                        {t("Change Search Settings")}
                    </button>
                </div>
            </div>

            { !item?.roomContractSets?.length ? <Loader /> :
            <div className="contract">
                <div className="table">
                    <table className="table agt">
                        <thead>
                            <tr>
                                <th>{t("Room Type")}</th>
                                <th className="price">{t("Price for")} {__plural(t, store.search?.numberOfNights, "Night")}</th>
                                <th className="pros" />
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                        { item?.roomContractSets?.map((roomContractSet, index) =>
                            <tr key={index}>
                                <td className="room-contract-set">
                                    <span onClick={() => this.roomContractSetSelect(roomContractSet, details)}>
                                        <GroupRoomTypesAndCount t={t} contracts={roomContractSet.rooms} />
                                    </span>
                                    {roomContractSet.supplier && <div className="black">
                                        Supplier: {" " + roomContractSet.supplier}
                                    </div>}
                                </td>
                                <td className="price">
                                    {price(roomContractSet.rate.finalPrice)}
                                </td>
                                <td className="pros">
                                    {roomContractSet.rooms[0]?.isDynamic === true &&
                                        <div className="one">
                                            <strong>
                                                {t("Dynamic offer")}
                                            </strong>
                                        </div>
                                    }
                                    {roomContractSet.isAdvancePurchaseRate &&
                                     (authStore.agencyAPR > APR_VALUES.DisplayOnly) &&
                                        <div className="one">
                                            <span className="restricted-rate">
                                                {t("Restricted Rate")}
                                            </span>
                                        </div>
                                    }
                                    <div className="one green">
                                        <MealPlan t={t} room={roomContractSet.rooms[0]} />
                                    </div>
                                    <div className="one">
                                        <Deadline t={t}
                                            searchId={store.search.id}
                                            resultId={store.selected.accommodation.id}
                                            roomContractSet={roomContractSet}
                                        />
                                    </div>
                                </td>
                                <td className="holder">
                                    {(roomContractSet.isAdvancePurchaseRate &&
                                     authStore.agencyAPR <= APR_VALUES.DisplayOnly) ?
                                        <button className="button small disabled">
                                            {t("Restricted Rate")}
                                        </button> :
                                        <button className="button small"
                                                onClick={() => this.roomContractSetSelect(roomContractSet, details)}>
                                            {t("Book")}
                                        </button>
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    { store.secondStepState != "Completed" &&
                        <Loader/>
                    }
                </div>
            </div>
            }
        </div>
    </section>
</div>
);
    }
}

export default AccommodationRoomContractsSetsPage;
