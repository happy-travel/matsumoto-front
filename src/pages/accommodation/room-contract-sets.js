import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import { groupAndCount } from "components/simple";

import { API, dateFormat, price, plural } from "core";
import store from 'stores/accommodation-store';
import View from "stores/view-store";
import AccommodationCommonDetails from "parts/accommodation-details";

import {
    FieldText,
    FieldCheckbox
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import { Stars, Loader } from "components/simple";
import Deadline from "components/deadline";

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
        API.post({
            url: API.A_SEARCH_STEP_THREE(
                store.selected.accommodation.availabilityId,
                roomContractSet.id,
                store.selected.accommodation.source
            ),
            success: (result) => {
                if (!result?.data) {
                    View.setTopAlertText("Sorry, this room is not available now (#2), try again later");
                    return;
                }
                this.setState({
                    redirectToBookingPage: true
                });
                store.selectRoomContractSet(result);
            },
            error: (error) => {
                View.setTopAlertText("Sorry, this room is not available now, try again later");
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

        if (!item?.accommodationDetails)
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
                    <Breadcrumbs noBackButton items={[
                        {
                            text: t("Find Accommodation")
                        }, {
                            text: store.search.request?.destination
                        }, {
                            text: item.accommodationDetails.name
                        }
                    ]}/>
                </div>
                { this.state.loading && <Loader page /> }

                <AccommodationCommonDetails
                    accommodation={item.accommodationDetails}
                    fromPage
                />

                <h2>{t("Room Availability")}</h2>

                <div class="billet">
                    <div class="part">
                        <div class="subpart">
                            <div class="h1">{t("Check In Date")}</div>
                            <div class="h2">{dateFormat.d(store.search.request.checkInDate)}</div>
                            { item.accommodationDetails?.schedule?.checkInTime &&
                              <div class="h3">{t("From")} {item.accommodationDetails.schedule.checkInTime}</div> }
                        </div>
                        <div class="subpart">
                            <div class="h1">{t("Check Out Date")}</div>
                            <div class="h2">{dateFormat.d(store.search.request.checkOutDate)}</div>
                            <div class="h3">{plural(t, store.search?.result?.numberOfNights, "Night")}</div>
                        </div>
                        <div class="subpart">
                            <div class="h1">{t("Guests")}</div>
                            <div class="h2">{plural(t, store.search.request.adultsTotal, "Adult")}</div>
                            {!!store.search.request.childrenTotal && <div class="h2">{plural(t, store.search.request.childrenTotal, "Children")}</div>}
                        </div>
                    </div>
                    <div class="part">
                        <button class="button small" onClick={this.showSearch}>
                            {t("Change Search Settings")}
                        </button>
                    </div>
                </div>

                <div class="variant">
                    <div class="table">
                        <table class="table agt">
                            <thead>
                                <tr>
                                    <th colSpan="2">{t("Room Type")}</th>
                                    <th class="price">{t("Price for")} {plural(t, store.search?.result?.numberOfNights, "Night")}</th>
                                    <th class="pros">{t("Pros")}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                            { item?.roomContractSets?.map(roomContractSet =>
                                <tr>
                                    <td class="room-contract-set">
                                        {groupAndCount(roomContractSet.roomContracts)}<br/>
                                        {roomContractSet.contractType}
                                    </td>
                                    <td class="icons">
                                        <span class="icon icon-man" />
                                        {(roomContractSet.roomContracts.length == 1 && roomContractSet.roomContracts[0].type == "Single") ? null : <span class="icon icon-man" />}
                                    </td>
                                    <td class="price">
                                        {price(roomContractSet.price)}
                                    </td>
                                    <td class="pros">
                                        {roomContractSet.isDynamic === true &&
                                            <div class="one">
                                                <strong>
                                                    {t("Dynamic offer")}
                                                </strong>
                                            </div>
                                        }
                                        <div class="one green">
                                            {roomContractSet.roomContracts[0].boardBasisCode
                                            }: {"RO" == roomContractSet.roomContracts[0].boardBasisCode ? t("Room Only") : (t("Breakfast Included") + ", " +
                                            roomContractSet.roomContracts[0].mealPlan) }
                                        </div>
                                        <div class="one">
                                            <Deadline t={t}
                                                roomContractSet={roomContractSet}
                                                availabilityId={store.selected.accommodation.availabilityId}
                                                source={store.selected.accommodation.source}
                                            />
                                        </div>
                                    </td>
                                    <td class="holder">
                                        <button class="button small" onClick={() => this.roomContractSetSelect(roomContractSet, item.accommodationDetails)}>
                                            {t("Book it")}
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    </div>
</React.Fragment>
);
    }
}

export default AccommodationRoomContractsSetsPage;
