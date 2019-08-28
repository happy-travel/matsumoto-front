import React from "react";
import { observer } from "mobx-react";
import AccommodationStore from "stores/accommodation-store";
import { useTranslation } from "react-i18next";

const Row = ({ t, text, field, value }) => (
    <div class="row">
        <div class="caption">{t(text)}</div>
        <div class="btn" onClick={() => AccommodationStore.setRequestRoomDetails(field, -1)}>–</div>
        <div class="value">{value}</div>
        <div class="btn" onClick={() => AccommodationStore.setRequestRoomDetails(field, +1)}>+</div>
    </div>
);

@observer
class PeopleDropdown extends React.Component {
    render() {
        var { t } = useTranslation(),
            roomDetails = AccommodationStore.roomDetails;

        return (
            <div class="people dropdown">
                <Row t={t}
                    text="Adult_plural"
                    field="adultsNumber"
                    value={roomDetails.adultsNumber}
                />
                <Row t={t}
                    text="Children"
                    field="childrenNumber"
                    value={roomDetails.childrenNumber}
                />
                <Row t={t}
                    text="Room_plural"
                    field="rooms"
                    value={roomDetails.rooms}
                />
            </div>
        );
    }
}

export default PeopleDropdown;
