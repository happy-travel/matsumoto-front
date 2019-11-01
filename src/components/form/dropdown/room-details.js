import React from "react";
import { observer } from "mobx-react";
import AccommodationStore from "stores/accommodation-store";
import { useTranslation } from "react-i18next";

const Row = ({ room, t, text, field, value }) => (
    <div class="row">
        <div class="caption">{t(text)}</div>
        <div
            class={"btn" + (AccommodationStore.setRequestRoomDetails(room, field, -1, "test") ? " enabled" : "")}
            onClick={() => AccommodationStore.setRequestRoomDetails(room, field, -1)}
        >–</div>
        <div class="value">{value}</div>
        <div
            class={"btn" + (AccommodationStore.setRequestRoomDetails(room, field, +1, "test") ? " enabled" : "")}
            onClick={() => AccommodationStore.setRequestRoomDetails(room, field, +1)}
        >+</div>
    </div>
);

@observer
class PeopleDropdown extends React.Component {
    render() {
        var { t } = useTranslation();

        return (
            <div class="people dropdown">
                <Row t={t}
                    room={0}
                    text="Room_plural"
                    field="rooms"
                    value={AccommodationStore.search.rooms}
                />

                {[...Array(AccommodationStore.search.rooms)].map((x, i) => (
                    <React.Fragment>
                        {(AccommodationStore.search.rooms > 1) && <h3>Room {i+1} Settings</h3>}
                        <Row t={t}
                             room={i}
                             text="Adult_plural"
                             field="adultsNumber"
                             value={AccommodationStore.getRoomDetails(i)?.adultsNumber}
                        />
                        <Row t={t}
                            room={i}
                            text="Children"
                            field="childrenNumber"
                            value={AccommodationStore.getRoomDetails(i)?.childrenNumber}
                        />
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default PeopleDropdown;
