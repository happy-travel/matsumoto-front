import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { STATUSES } from "tasks/accommodation/search-create"
import { searchLoaderWithNewOrder } from "tasks/accommodation/search-loaders";
import { searchGetRooms } from "tasks/accommodation/search-get-rooms";
import { redirect } from "core";
import { GroupRoomTypesAndCount, MealPlan, Stars, Loader, PassengersCount, price } from "simple";
import Breadcrumbs from "components/breadcrumbs";
import Deadline from "components/deadline";
import SorterDropdown from "components/complex/sorter";
import AccommodationFilters from "parts/accommodation-filters";
import { searchLoader } from "tasks/accommodation/search-loaders";
import AccommodationTitlePage from "./title";
import store from "stores/accommodation-store";
import View, { MODALS } from "stores/view-store";

@observer
class AccommodationSearchResultsPage extends React.Component {
    componentDidMount() {
        if (store.search?.loading == "__filter_tmp")
            store.setSearchIsLoading(null);
    }

    accommodationSelect = (result) => {
        redirect("/search/contract");
        searchGetRooms(result);
    };

    loadNextPage() {
        searchLoader((store.search.page || 0) + 1);
    }

    render() {
        const { t } = useTranslation();

        if (!store?.search?.request?.destination)
            return <AccommodationTitlePage />;

        return (
<div className="search-results block">
    {__devEnv && <div className="hide">{JSON.stringify(store.filters?.source)}</div> }
    { store?.search?.loading === true ?
    <Loader /> :
    <section className="double-sections">
        { (store.search?.loading == "__filter_tmp") && <Loader segment /> }
        <AccommodationFilters />
        <div className="right-section">
            <div className="head">
                <div className="title">
                    <h3>
                        {t("Results for")} <b>{ store.search.request.destination }</b>
                        <span>&nbsp;(
                            {store.search.length}
                            { store.search.status == STATUSES.PARTIALLY_COMPLETED ? "+" : "" }
                        )</span>
                    </h3>
                    <Breadcrumbs noBackButton items={[
                        {
                            text: t("Search Accommodations"),
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
                    className={__class(store.sorter?.price < 0, "reverse")}
                    sorter={value => searchLoaderWithNewOrder(value)}
                    options={[
                        { title: t("Usual"), order: {} },
                        { title: t("Price (high to low)"), order: { price: 1 } },
                        { title: t("Price (low to high)"), order: { price: -1 } },
                    ]}
                />
            </div>

            { (!store.hotelArray.length && !store?.search?.loading && !store.filtersLine) &&
                <div style={{ paddingTop: "50px" }}>
                    <div className="head">
                        <div className="title">
                            <h3>{t("Can't find what you're looking for?")}</h3>
                            <br/>
                            {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                            <br/>
                            <br/>
                            {t("Email")}: <a href="mailto:reservations@happytravel.com" className="link">reservations@happytravel.com</a>
                        </div>
                    </div>
                </div> }

            <InfiniteScroll
                dataLength={store.hotelArray.length}
                next={this.loadNextPage}
                hasMore={store.search.hasMoreSearchResults}
                loader={(store.search?.loading !== "__filter_tmp") ? <Loader /> : null}
            >
            { store.hotelArray.map(item =>
            <div className="contract" key={item.accommodation.id}>
                <div className="summary">
                    { item.accommodation.photo.sourceUrl && <div className="photo" onClick={() => this.accommodationSelect(item)}>
                        <img src={item.accommodation.photo.sourceUrl} alt={item.accommodation.photo.caption}  />
                    </div> }
                    <div className="title">
                        <div className="features">
                            <button className={"button mini-label" + __class(item.hasDuplicate, "gray")}
                                    id={item.supplier + "." + item.accommodation.id}
                                    onClick={
                                        () => View.setModal(MODALS.REPORT_DUPLICATE, item)
                                    }>
                                {item.hasDuplicate ? t("Marked as Duplicate") : t("Mark as duplicate")}
                            </button>
                        </div>
                        <h2 onClick={() => this.accommodationSelect(item)}>
                            <u>{item.accommodation.name}</u>
                            <Stars count={item.accommodation.rating} />
                        </h2>
                        <div className="category" onClick={() => this.accommodationSelect(item)}>
                                {t("Accommodation in")} {item.accommodation.location.country}, {item.accommodation.location.locality}<br/>
                            {item.accommodation.location.address}
                        </div>
                        {item.supplier && <div>
                            Supplier: {" " + item.supplier}
                        </div>}
                    </div>
                </div>
                <div className="table">
                    <div className="title">
                        {
                            t("At least")
                        } {__plural(
                            t,
                            item.roomContractSets.length > 2 ?
                                item.roomContractSets.length-1 :
                                item.roomContractSets.length,
                            "option"
                        )} {
                            t("available for")
                        } <PassengersCount t={t}
                                           adults={store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber), 0)}
                                           children={store.search.request.roomDetails.reduce((res,item) => (res+item.childrenNumber), 0)}/>
                    </div>
                    <div className="billet">
                        <div className="count">
                            {__plural(t, store.search.numberOfNights, "Night")}
                            , <PassengersCount t={t}
                                               adults={store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber), 0)}
                                               children={store.search.request.roomDetails.reduce((res,item) => (res+item.childrenNumber), 0)}
                                               separator={", "} />
                        </div>
                        <div className="price">
                            <span>{t("From")}</span>
                            {price(item.roomContractSets?.[0]?.rate.currency, item.minPrice)}
                        </div>
                        <button className="button small main" onClick={() => this.accommodationSelect(item)}>
                            {t("Choose Your Room")}
                        </button>
                    </div>
                    { item.roomContractSets.slice(0, 2).map((roomContractSet, index) =>
                    <div className="row" key={index}>
                        <div className="main">
                            <h3 onClick={() => this.accommodationSelect(item)}>
                                <GroupRoomTypesAndCount t={t} contracts={roomContractSet.rooms} />
                            </h3>
                            <div>
                                {roomContractSet.rooms[0]?.isDynamic === true &&
                                    <div>
                                        <strong>
                                            {t("Dynamic offer")}
                                        </strong>
                                    </div>
                                }
                                {roomContractSet.isAdvancePurchaseRate &&
                                    <div>
                                        <span className="restricted-rate">
                                            {t("Restricted Rate")}
                                        </span>
                                    </div>
                                }
                                <Deadline t={t}
                                     searchId={store.search.id}
                                     resultId={item.id}
                                     roomContractSet={roomContractSet}
                                />
                                { !!roomContractSet.tags?.length &&
                                    <div>
                                        { roomContractSet.tags?.includes("direct-connectivity") &&
                                            <span>
                                                Direct Connectivity
                                            </span>
                                        }
                                    </div>
                                }
                            </div>
                            <div className="info green">
                                <MealPlan t={t} room={roomContractSet.rooms[0]} />
                            </div>
                        </div>
                    </div>) }
                </div>
            </div>) }
            </InfiniteScroll>
            {store.search?.loading && <Loader />}
        </div>
    </section> }
</div>
        );
    }
}

export default AccommodationSearchResultsPage;
