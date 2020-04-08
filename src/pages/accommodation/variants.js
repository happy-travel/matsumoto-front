import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import { groupAndCount, MealPlan } from "components/simple";

import { API, price, plural } from "core";
import store from 'stores/accommodation-store';
import UI, { MODALS } from "stores/ui-store";

import AccommodationFilters from "parts/accommodation-filters";
import Breadcrumbs from "components/breadcrumbs";
import { Stars, Loader } from "components/simple";
import Deadline from "components/deadline";

@observer
class AccommodationVariantsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToRoomContractSetsPage: false,
            loading: false
        };
        this.showDetailsModal = this.showDetailsModal.bind(this);
    }

    showDetailsModal(item) {
        UI.setModal(MODALS.ACCOMMODATION_DETAILS);
        UI.setModalData(null);
        API.get({
            url: API.ACCOMMODATION_DETAILS(item.accommodationDetails.id, item.source),
            success: result => UI.setModalData(result)
        });
    }

    accommodationSelect(accommodation) {
        this.setState({
            loading: true
        });
        API.post({
            url: API.A_SEARCH_STEP_TWO(
                accommodation.availabilityId,
                accommodation.accommodationDetails.id,
                accommodation.source
            ),
            success: result => {
                store.selectAccommodation(result);
                this.setState({
                    redirectToRoomContractSetsPage: true
                });
            },
            after: () => {
                this.setState({
                    loading: false
                });
            }
        });
    }

    render() {
        const { t } = useTranslation();

        if (this.state.redirectToRoomContractSetsPage)
            return <Redirect push to="/search/contract" />;

        return (

<React.Fragment>
    <div class="variants block">
        { store?.search?.loading ?
        <Loader /> :

        <section class="double-sections">
            <AccommodationFilters />
            <div class="right-section">
                <div class="head">
                    <div class="title">
                        <h3>
                            {t("Results for")}: <b>{ store?.search?.request?.destination }</b>

                            {!!store.hotelArray.length &&
                                <span>&nbsp;({store.hotelArray.length}&nbsp;
                                    { !!store.search.result?.numberOfProcessedResults && <React.Fragment>
                                        {t("out of")} {store.search.result?.numberOfProcessedResults} {t("available")})
                                    </React.Fragment> }
                                </span>
                            }
                        </h3>
                        <Breadcrumbs noBackButton items={[
                            {
                                text: t("Find Accommodation"),
                                link: '/'
                            }, {
                                text: store.search.request?.destination
                            }
                        ]}/>
                        { !store.hotelArray.length &&
                            <h3>
                                <span>
                                    {t("No accommodations available")}
                                </span>
                            </h3>
                        }
                    </div>
                    { /* todo:
                    <div class="sorter">
                        <button class="button-expand">
                            {t("Sort by")}
                        </button>
                    </div>
                    <div class="input-wrap">
                        <div class="form">
                            <FieldText
                                placeholder={t("Search by a hotel name...")}
                            />
                        </div>
                    </div>
                    */ }
                </div>

                { !store.hotelArray.length &&
                    <div style={{ paddingTop: "50px" }}>
                        <div class="head">
                            <div class="title">
                                <h3>{t("Found nothing?")}</h3>
                                <br/>
                                {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                                <br/>
                                <br/>
                                {t("Email")}: <a href="mailto:info@happytravel.com" class="link">info@happytravel.com</a>
                            </div>
                        </div>
                    </div> }

                { this.state.loading && <Loader page /> }

                { store.hotelArray.map(item =>
                <div class="variant" key={item.accommodationDetails.id}>
                    <div class="summary">
                        { item.accommodationDetails.picture.source && <div class="photo">
                            <img src={item.accommodationDetails.picture.source} alt="" />
                        </div> }
                        <div class="title" onClick={() => this.showDetailsModal(item)} >
                            <h2>
                                <u>{item.accommodationDetails.name}</u>
                                <Stars count={item.accommodationDetails.rating} />
                            </h2>
                            <div class="category">
                                {t("Accommodation in")} {item.accommodationDetails.location.country}, {item.accommodationDetails.location.locality}<br/>
                                {item.accommodationDetails.location.address}
                            </div>
                            <div class="features">
                                <span class="icon icon-info-big"/>
                                { /* todo: <span class="icon icon-map" /> */ }
                                { /* todo: <span class="button pink mini-label">{t("Preferred")}</span> */ }
                            </div>
                        </div>
                        <div class="prices">
                            <div class="from">{t("From")}</div>
                            <div class="value">{price(item.roomContractSets?.[0]?.price.currency, item.fromPrice)}</div>
                        </div>
                    </div>
                    <div class="description">
                        <span>{t("Located in")} {item.accommodationDetails.location.locality}, {item.accommodationDetails.location.country} {item.accommodationDetails.name}.{" "}
                            {item.accommodationDetails.generalTextualDescription && item.accommodationDetails.generalTextualDescription.descriptions && item.accommodationDetails.generalTextualDescription.descriptions.en}</span>
                    </div>
                    <div class="table">
                        <div class="title">
                            {t("Recommended option for")}{" "}
                            {plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}
                        </div>
                        <div class="billet">
                            <div class="count">
                                {plural(t, store.search.result.numberOfNights, "Night")},
                                {" "}{plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}
                            </div>
                            <div class="price">
                                {price(item.roomContractSets?.[0]?.price)}
                            </div>
                            <button class="button small" onClick={() => this.accommodationSelect(item)}>
                                {t("Choose Room")}
                            </button>
                        </div>
                        { item.roomContractSets.slice(0, 2).map(roomContractSet => <div class="row">
                            <div class="icons">
                                <span class="icon icon-man" />
                                {(roomContractSet.roomContracts.length == 1 && roomContractSet.roomContracts[0].type == "Single") ? null : <span class="icon icon-man" />}
                            </div>
                            <div class="main">
                                <h3>
                                    {groupAndCount(roomContractSet.roomContracts)}
                                </h3>
                                <div>
                                    {roomContractSet.isDynamic === true &&
                                        <strong>
                                            {t("Dynamic offer")}
                                        </strong>
                                    }
                                    <Deadline t={t}
                                        roomContractSet={roomContractSet}
                                        availabilityId={item.availabilityId}
                                        source={item.source}
                                    />
                                </div>
                                <div class="info green">
                                    <MealPlan t={t} room={roomContractSet.roomContracts[0]} />
                                </div>
                                <div class="paragraph">
                                    {roomContractSet.roomContracts[0].contractType}
                                </div>
                            </div>
                        </div>) }
                    </div>
                </div>) }
            </div>
        </section> }
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
