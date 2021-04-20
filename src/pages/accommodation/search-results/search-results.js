import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { SEARCH_STATUSES } from "enum";
import { subscribeSearchResults, searchLoadWithNewFilters } from "tasks/accommodation/search-loaders";
import { PassengersCount, date } from "simple";
import { Loader } from "components/simple";
import AccommodationSearchFilters from "parts/search-filters/accommodation-filters";
import AccommodationSearchSorters from "parts/search-filters/accommodation-sorters";
import SearchNothingFound from "./search-nothing-found";
import { searchLoadNextPage } from "tasks/accommodation/search-loaders";
import AccommodationTitlePage from "../title";
import AccommodationSearchResultContract from "./search-result-contract";
import SearchBigLoader from "./search-big-loader";
import { $accommodation } from "stores";

const AccommodationSearchResultsPage = observer(() => {
    const { t } = useTranslation();
    const [filtersLastUpdated, setFiltersLastUpdated] = useState(0);

    useEffect(() => {
        const interval = subscribeSearchResults();
        return () => {
            clearInterval(interval);
        };
    }, []);

    const clearFilters = () => {
        searchLoadWithNewFilters(null);
        setFiltersLastUpdated(Number(new Date()));
    };

    const { search, hotelArray, filtersLine, filters } = $accommodation;
    const { taskState, request } = search;

    if (!search.request?.destination || !search.taskState || (!search.id && SEARCH_STATUSES.BROKEN === search.taskState))
        return <AccommodationTitlePage noSearch />;

    document.title = request.destination + " – " + "Happytravel.com";

    if (!SEARCH_STATUSES.isHasResponse(taskState) || (!search.result.length && SEARCH_STATUSES.PARTIALLY_COMPLETED === taskState))
        return (
            <SearchBigLoader
                key={search.createdAt}
                destination={search.request.destination}
            />
        );

    return (
        <div className="search-results block">
            {__devEnv && <div className="hide">{JSON.stringify(filters?.source)}</div> }
            { search.loading &&
                <Loader page />
            }
            <section>
                <div className="head">
                    <div className="request">
                        <span>
                            {date.format.day(request.checkInDate)} – {date.format.day(request.checkOutDate)}
                        </span> •{" "}
                        <span>{__plural(t, search.numberOfNights, "Night")}</span> •{" "}
                        <span>
                            <PassengersCount
                                adults={request.roomDetails.reduce((res,item) => (res+item.adultsNumber), 0)}
                                children={request.roomDetails.reduce((res,item) => (res+item.childrenNumber), 0)}
                            />
                        </span>
                    </div>

                    <div className="title">
                        <h2>
                            {t("Accommodations in")} {request.destination}{" "}
                            <span>
                                ({search.resultCount}{ !SEARCH_STATUSES.isFinished(taskState) && "+" })
                            </span>
                        </h2>
                    </div>

                    { !!search.result.length &&
                        <div className="filtration">
                            <AccommodationSearchFilters
                                key={filtersLastUpdated}
                                update={setFiltersLastUpdated}
                            />
                            <AccommodationSearchSorters />
                        </div>
                    }
                </div>

                { !hotelArray.length && !search.loading &&
                    <SearchNothingFound
                        resultCount={search.resultCount}
                        filters={filtersLine}
                        clearFilters={clearFilters}
                    />
                 }

                <InfiniteScroll
                    dataLength={hotelArray.length}
                    next={searchLoadNextPage}
                    hasMore={search.hasMoreSearchResults}
                    loader={null}
                >
                    { hotelArray.map(item => (
                        <AccommodationSearchResultContract
                            key={item.id}
                            contract={item}
                        />
                    ))}
                </InfiniteScroll>

                { (search.hasMoreSearchResults || !SEARCH_STATUSES.isFinished(search.taskState)) ?
                    <Loader /> :
                    ( !!hotelArray.length &&
                        <div className="finish">
                            Shown {hotelArray.length} out of {search.resultCount}
                        </div>
                    )
                }
            </section>
        </div>
    );
});

export default AccommodationSearchResultsPage;
