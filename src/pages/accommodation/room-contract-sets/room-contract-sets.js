import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API, redirect } from "core";
import { SEARCH_STATUSES } from "enum";
import { subscribeSearchRoomsResults } from "tasks/accommodation/search-rooms-loaders";
import ViewFailed from "parts/view-failed";
import { Loader } from "components/simple";
import { HotelStars } from "components/accommodation";
import Gallery from "components/gallery";
import Breadcrumbs from "components/breadcrumbs";
import RoomSummary from "../parts/room-summary";
import Amenities from "./amenities";
import RequestSummary from "./request-summary";
import { $accommodation, $notifications } from "stores";

const HEADER_SCROLL_CORRECTION_DESKTOP = 160;
const HEADER_SCROLL_CORRECTION_MOBILE = 180;
const HEADER_SCROLL_CORRECTION_PHONE = 100;
const PHONE_WIDTH = 768;
const DESKTOP_WIDTH = 1000;

const scroll = (event, id) => {
    let correction = HEADER_SCROLL_CORRECTION_DESKTOP;
    if (window.innerWidth < DESKTOP_WIDTH)
        correction = HEADER_SCROLL_CORRECTION_MOBILE;
    if (window.innerWidth < PHONE_WIDTH)
        correction = HEADER_SCROLL_CORRECTION_PHONE;
    window.scrollTo(
        0,
        (document.getElementById(id || (event.target.dataset["scroll"]))?.offsetTop || 0) - correction
    );
};

const onScroll = () => {
    let buttons, elements, throttle;
    if (window.innerWidth < DESKTOP_WIDTH)
        return;
    if (throttle)
        return;
    throttle = setTimeout(() => {
        if (!elements?.length) {
            buttons = [...document.querySelectorAll("[data-scroll]")];
            elements = buttons.map(item => document.getElementById(item.dataset["scroll"]));
        }
        if (!buttons.length)
            return;
        const scrollTop = window.scrollY + HEADER_SCROLL_CORRECTION_DESKTOP + 50;
        const tops = [...elements.map(item => item.offsetTop), scrollTop].sort((a,b)=>a-b);
        const selected = Math.max(0, Math.min(elements.length, tops.indexOf(scrollTop))-1);
        if (buttons[selected]?.className != "item active") {
            buttons.forEach(item => item.className = "item");
            buttons[selected].className = "item active";
        }
        throttle = null;
    }, 250);
};

const AccommodationRoomContractsSetsPage = observer(() => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const selectedAccommodation = $accommodation.selected.accommodation;
    const details = $accommodation.selected.accommodationFullDetails || selectedAccommodation?.accommodation;
    const roomsTaskState = $accommodation.search.roomsTaskState;

    useEffect(() => {
        document.addEventListener("scroll", onScroll);
        const interval = subscribeSearchRoomsResults();
        return () => {
            document.removeEventListener("scroll", onScroll);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            scroll(undefined, "rooms");
        }, 100);
    }, [details]);

    //todo: move to booking logic block
    const roomContractSetSelect = (roomContractSet) => {
        setLoading(true);
        API.get({
            url: API.A_SEARCH_STEP_THREE(
                $accommodation.search.id,
                selectedAccommodation.id,
                roomContractSet.id
            ),
            success: (result) => {
                if (!result?.availabilityId) {
                    $notifications.addNotification("Sorry, this room is not available now, try again later");
                    return;
                }
                $accommodation.selectRoomContractSet(result, roomContractSet);
                redirect("/accommodation/booking");
            },
            after: () => setLoading(false)
        });
    };

    if (SEARCH_STATUSES.BROKEN === roomsTaskState)
        return (
            <ViewFailed
                button={t("View Other Options")}
                link="/search"
            />
        );

    if (!selectedAccommodation?.id) {
        redirect("/");
        return null;
    }

    if (!details)
        return <Loader page />;

    const description = details.textualDescriptions?.[0]?.description || details.textualDescriptions?.[1]?.description;

    return (
    <div className="search-results block">
        { loading && <Loader page /> }
        <section>
            <div className="hide-desktop">
                <Breadcrumbs
                    backLink="/search"
                    backText={t("View Other Options")}
                />
            </div>
            <div className="head" id="overview">
                <div className="request">
                    {details.location.locality}, {details.location.address}
                    {details.contacts?.phone ? ", " + details.contacts.phone : ""}
                </div>
                <div className="title">
                    <h1>{details.name}</h1>
                    <HotelStars count={details.rating} />
                </div>
            </div>
        </section>
        <div className="navigation">
            <section>
                <nav>
                    <li><div onClick={scroll} data-scroll="overview" className="item active">{t("Overview")}</div></li>
                    <li><div onClick={scroll} data-scroll="information" className="item">{t("Information")}</div></li>
                    <li><div onClick={scroll} data-scroll="rooms" className="item">{t("Rooms")}</div></li>
                </nav>
            </section>
        </div>
        <section>
            <Gallery pictures={details?.photos} />
            <div className="billet-wrapper contract">
                <RequestSummary />
                <div className="another" id="information">
                    <h2>{t("Accommodation Information")}</h2>
                    <div className="text">
                        <div dangerouslySetInnerHTML={{__html: description}} />
                        { details.schedule.checkInTime &&
                            <div className="checkin-time">
                                {t("Check-in from")}{" "}
                                {details.schedule.checkInTime?.substr(0,5) || details.schedule.checkInTime}
                            </div>
                        }
                    </div>

                    <h2>{t("Accommodation Amenities")}</h2>
                    <Amenities hotel={details} />

                    <h2 id="rooms">{t("Room Availability")}</h2>
                    <div className="rooms">
                        { selectedAccommodation.roomContractSets?.map((roomContractSet, index) => (
                            <RoomSummary
                                key={index}
                                roomContractSet={roomContractSet}
                                resultId={selectedAccommodation.id}
                                onSelect={() => roomContractSetSelect(roomContractSet)}
                                secondStep
                            />
                        ))}
                        { !SEARCH_STATUSES.isFinished(roomsTaskState) &&
                            <Loader/>
                        }
                        { SEARCH_STATUSES.isFinished(roomsTaskState) && !selectedAccommodation.roomContractSets?.length &&
                            <ViewFailed
                                reason={t("No accommodations available")}
                                button={t("View Other Options")}
                                link="/search"
                            />
                        }
                    </div>
                </div>
            </div>
        </section>
    </div>
    );
});

export default AccommodationRoomContractsSetsPage;
