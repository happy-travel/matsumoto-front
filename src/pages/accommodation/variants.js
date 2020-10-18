import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { loadCurrentSearchWithNewOrder } from "parts/search/search-logic";
import { runSearchSecondStep } from "parts/search/search-logic-step2";

import {
    GroupRoomTypesAndCount, MealPlan, Stars, Loader, PassengersCount, price
} from "simple";
import Breadcrumbs from "components/breadcrumbs";
import Deadline from "components/deadline";
import SorterDropdown from "components/complex/sorter";

import AccommodationFilters from "parts/accommodation-filters";
import { loadCurrentSearch } from "parts/search/search-logic";
import AccommodationTitlePage from "./title";

import store from "stores/accommodation-store";
import UI, { MODALS } from "stores/ui-store";

@observer
class AccommodationVariantsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToRoomContractSetsPage: false
        };
        this.loadNextPage = this.loadNextPage.bind(this);
    }

    componentDidMount() {
        if (store.search?.loading == "__filter_tmp")
            store.setSearchIsLoading(null);
    }

    accommodationSelect(result) {
        this.setState({
            redirectToRoomContractSetsPage: true
        });

        runSearchSecondStep(result);
    }

    loadNextPage() {
        loadCurrentSearch((store.search.page || 0) + 1);
    }

    render() {
        const { t } = useTranslation();

        if (this.state.redirectToRoomContractSetsPage)
            return <Redirect push to="/search/contract" />;

        if (!store?.search?.request?.destination)
            return <AccommodationTitlePage />;

        return (

<React.Fragment>
    <div class="variants block">
        {__devEnv && <div class="hide">{JSON.stringify(store.filters?.source)}</div> }
        { store?.search?.loading === true ?
        <Loader /> :
        <section class="double-sections">
            { (store.search?.loading == "__filter_tmp") && <Loader segment /> }
            <AccommodationFilters />
            <div class="right-section">
                <div class="head">
                    <div class="title">
                        <h3>
                            {t("Results for")} <b>{ store.search.request.destination }</b>
                            <span>&nbsp;(
                                {store.search.length}
                                { store.search.status == "PartiallyCompleted" ? "+" : "" }
                            )</span>
                        </h3>
                        <Breadcrumbs noBackButton items={[
                            {
                                text: t("Find Accommodation"),
                                link: '/'
                            }, {
                                text: store.search.request.destination
                            }
                        ]}/>
                        { !store.hotelArray.length && !store?.search?.loading &&
                            <h3>
                                <span>
                                    {t("No accommodations available")}
                                </span>
                            </h3>
                        }
                    </div>
                    <SorterDropdown
                        text={t("Sort by") + " " + (store.sorter?.price ? t("price") : "")}
                        addClass={__class(store.sorter?.price < 0, "reverse")}
                        sorter={value => loadCurrentSearchWithNewOrder(value)}
                        options={[
                            { title: t("Usual"), order: {} },
                            { title: t("High price first"), order: { price: 1 } },
                            { title: t("Low price first"), order: { price: -1 } },
                        ]}
                    />
                    { /* todo:
                    <div class="input-wrap">
                        <div class="form">
                            <FieldText
                                placeholder={t("Search by a hotel name...")}
                            />
                        </div>
                    </div>
                    */ }
                </div>

                { (!store.hotelArray.length && !store?.search?.loading && !store.filtersLine) &&
                    <div style={{ paddingTop: "50px" }}>
                        <div class="head">
                            <div class="title">
                                <h3>{t("Found nothing?")}</h3>
                                <br/>
                                {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                                <br/>
                                <br/>
                                {t("Email")}: <a href="mailto:reservations@happytravel.com" class="link">reservations@happytravel.com</a>
                            </div>
                        </div>
                    </div> }

                <InfiniteScroll
                    dataLength={store.hotelArray.length}
                    next={this.loadNextPage}
                    hasMore={store.search.hasMoreVariants}
                    loader={(store.search?.loading !== "__filter_tmp") ? <Loader /> : null}
                >
                { store.hotelArray.map(item =>
                <div class="variant" key={item.accommodation.id}>
                    <div class="summary">
                        { item.accommodation.picture.source && <div class="photo" onClick={() => this.accommodationSelect(item)}>
                            <img src={item.accommodation.picture.source} alt="" />
                        </div> }
                        <div class="title">
                            <div class="features">
                                <button class={"button mini-label" + __class(item.hasDuplicate, "gray", "transparent-with-border")}
                                        id={item.source + "." + item.accommodation.id}
                                        onClick={() => {
                                            UI.setModal(MODALS.REPORT_DUPLICATE);
                                            UI.setModalData(item);
                                        }}>
                                    {item.hasDuplicate ? t("Marked as Duplicate") : t("Mark as duplicate")}
                                </button>
                            </div>
                            <h2 onClick={() => this.accommodationSelect(item)}>
                                <u>{item.accommodation.name}</u>
                                <Stars count={item.accommodation.rating} />
                            </h2>
                            <div class="category" onClick={() => this.accommodationSelect(item)}>
                                    {t("Accommodation in")} {item.accommodation.location.country}, {item.accommodation.location.locality}<br/>
                                {item.accommodation.location.address}
                            </div>
                            {item.dataProvider && <div>
                                Data provider: {" " + item.dataProvider}
                            </div>}
                            { /*
                            <div class="features">
                                <span class="icon icon-info-big"/>
                                <span class="icon icon-map" />
                                <span class="button pink mini-label">{t("Preferred")}</span>
                            </div>
                            */ }
                        </div>
                    </div>
                    <div class="table">
                        <div class="title">
                            {__plural(t, item.roomContractSets.length, "option")} {t("available for")
                            } <PassengersCount t={t}
                                               adults={store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber), 0)}
                                               children={store.search.request.roomDetails.reduce((res,item) => (res+item.childrenNumber), 0)}/>
                        </div>
                        <div class="billet">
                            <div class="count">
                                {__plural(t, store.search.numberOfNights, "Night")}
                                , <PassengersCount t={t}
                                                   adults={store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber), 0)}
                                                   children={store.search.request.roomDetails.reduce((res,item) => (res+item.childrenNumber), 0)}
                                                   separator={", "} />
                            </div>
                            <div class="price">
                                <span>{t("From")}</span>
                                {price(item.roomContractSets?.[0]?.price.currency, item.fromPrice)}
                            </div>
                            <button class="button small" onClick={() => this.accommodationSelect(item)}>
                                {t("Choose Room")}
                            </button>
                        </div>
                        { item.roomContractSets.slice(0, 2).map(roomContractSet => <div class="row">
                            <div class="main">
                                <h3 onClick={() => this.accommodationSelect(item)}>
                                    <GroupRoomTypesAndCount t={t} contracts={roomContractSet.roomContracts} />
                                </h3>
                                <div>
                                    {roomContractSet.roomContracts[0]?.isDynamic === true &&
                                        <strong>
                                            {t("Dynamic offer")}
                                        </strong>
                                    }
                                    {roomContractSet.roomContracts[0]?.isAdvancedPurchaseRate &&
                                        <span class="restricted-rate">
                                            {t("Restricted Rate")}
                                        </span>
                                    }
                                    <Deadline t={t}
                                         searchId={store.search.id}
                                         resultId={item.id}
                                         roomContractSet={roomContractSet}
                                    />
                                </div>
                                <div class="info green">
                                    <MealPlan t={t} room={roomContractSet.roomContracts[0]} />
                                </div>
                            </div>
                        </div>) }
                    </div>
                </div>) }
                </InfiniteScroll>
                {(store.search.status != "Completed") && <Loader />}
            </div>
        </section> }
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
