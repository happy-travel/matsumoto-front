import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import { API } from "core";

import {
    GroupRoomTypesAndCount, MealPlan, Loader, PassengersCount, dateFormat, price
} from "simple";

import Breadcrumbs from "components/breadcrumbs";
import Deadline from "components/deadline";

import AccommodationCommonDetails from "parts/accommodation-details";

import store from 'stores/accommodation-store';
import View from "stores/view-store";
import authStore, { APR_VALUES } from "stores/auth-store";

@observer
class AccommodationRoomContractsSetsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingPage: false,
            redirectToVariantsPage: false,
            loading: false
        };
        this.roomContractSetSelect = this.roomContractSetSelect.bind(this);
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 400);
    }

    back() {
        this.setState({
            redirectToVariantsPage: true
        });
    }

    showSearch() {
        window.scrollTo(0, 0);
    }

    roomContractSetSelect(roomContractSet) {
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
                    View.setTopAlertText("Sorry, this room is not available now, try again later");
                    return;
                }
                store.selectRoomContractSet(result, roomContractSet);
                this.setState({
                    redirectToBookingPage: true
                });
            },
            error: (error) => {
                View.setTopAlertText(error?.detail || error?.message);
                if (error)
                    console.log("error: " + error);
            },
            after: () => {
                this.setState({
                    loading: false
                });
            }
        });
    }

    render() {
        const { t } = useTranslation(),
            item = store.selected.accommodation;

        if (this.state.redirectToBookingPage)
            return <Redirect push to="/accommodation/booking" />;

        if (this.state.redirectToVariantsPage)
            return <Redirect push to="/search" />;

        if (store.secondStepState === null)
            return <Loader />;

        const details = store.selected.accommodationFullDetails || item?.accommodation;

        if (!details)
            return null;

        return (

<React.Fragment>
    <div class="variants block room-contract-sets">
        <section class="double-sections">
            <div class="left-section filters">
                <div class="billet">
                    <div class="line">
                        {t("Like, but are you not sure?")}
                    </div>
                    <button class="button small" onClick={this.back}>
                        {t("Similar accommodations")}
                    </button>
                </div>
            </div>
            <div class="right-section">
                <div class="title">
                    <Breadcrumbs items={[
                        {
                            text: t("Find Accommodation"),
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

                <div class="billet">
                    <div class="part">
                        <div class="subpart">
                            <div class="h1">{t("Check In Date")}</div>
                            <div class="h2">{dateFormat.d(store.search.request.checkInDate)}</div>
                            { details?.schedule?.checkInTime &&
                              <div class="h3">{t("From")} {details.schedule.checkInTime}</div> }
                        </div>
                        <div class="subpart">
                            <div class="h1">{t("Check Out Date")}</div>
                            <div class="h2">{dateFormat.d(store.search.request.checkOutDate)}</div>
                            <div class="h3">{__plural(t, store.search?.numberOfNights, "Night")}</div>
                        </div>
                        <div class="subpart">
                            <div class="h1">{t("Guests")}</div>
                            <div class="h2"><PassengersCount t={t} adults={store.search.request.adultsTotal} /></div>
                            <div class="h2"><PassengersCount t={t} children={store.search.request.childrenTotal} /></div>
                        </div>
                    </div>
                    <div class="part">
                        <button class="button small" onClick={this.showSearch}>
                            {t("Change Search Settings")}
                        </button>
                    </div>
                </div>

                { !item?.roomContractSets?.length ? <Loader /> :
                <div class="variant">
                    <div class="table">
                        <table class="table agt">
                            <thead>
                                <tr>
                                    <th>{t("Room Type")}</th>
                                    <th class="price">{t("Price for")} {__plural(t, store.search?.numberOfNights, "Night")}</th>
                                    <th class="pros" />
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                            { item?.roomContractSets?.map(roomContractSet =>
                                <tr>
                                    <td class="room-contract-set">
                                        <span onClick={() => this.roomContractSetSelect(roomContractSet, details)}>
                                            <GroupRoomTypesAndCount t={t} contracts={roomContractSet.rooms} />
                                        </span>
                                        {roomContractSet.dataProvider && <div class="black">
                                            Data provider: {" " + roomContractSet.dataProvider}
                                        </div>}
                                    </td>
                                    <td class="price">
                                        {price(roomContractSet.price.netTotal)}
                                    </td>
                                    <td class="pros">
                                        {roomContractSet.rooms[0]?.isDynamic === true &&
                                            <div class="one">
                                                <strong>
                                                    {t("Dynamic offer")}
                                                </strong>
                                            </div>
                                        }
                                        {roomContractSet.rooms[0]?.isAdvancedPurchaseRate &&
                                         (authStore.agencyAPR > APR_VALUES.DisplayOnly) &&
                                            <div class="one">
                                                <span class="restricted-rate">
                                                    {t("Restricted Rate")}
                                                </span>
                                            </div>
                                        }
                                        <div class="one green">
                                            <MealPlan t={t} room={roomContractSet.rooms[0]} />
                                        </div>
                                        <div class="one">
                                            <Deadline t={t}
                                                searchId={store.search.id}
                                                resultId={store.selected.accommodation.id}
                                                roomContractSet={roomContractSet}
                                            />
                                        </div>
                                    </td>
                                    <td class="holder">
                                        {(roomContractSet.rooms[0]?.isAdvancedPurchaseRate &&
                                         authStore.agencyAPR <= APR_VALUES.DisplayOnly) ?
                                            <button class="button small disabled">
                                                {t("Restricted Rate")}
                                            </button> :
                                            <button class="button small"
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
</React.Fragment>
);
    }
}

export default AccommodationRoomContractsSetsPage;
