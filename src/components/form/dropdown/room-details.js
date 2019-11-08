import React from "react";
import { plural } from "core";
import { observer } from "mobx-react";
import store, { defaultChildrenAge } from "stores/accommodation-store";
import { useTranslation } from "react-i18next";
import { FieldText } from "components/form";
import { Formik } from "formik";

const Row = ({ room, t, text, field, value }) => (
    <div class="row">
        <div class="caption">{t(text)}</div>
        <div
            class={"btn" + (store.setRequestRoomDetails(room, field, -1, "test") ? " enabled" : "")}
            onClick={() => store.setRequestRoomDetails(room, field, -1)}
        >–</div>
        <div class="value">{value}</div>
        <div
            class={"btn" + (store.setRequestRoomDetails(room, field, +1, "test") ? " enabled" : "")}
            onClick={() => store.setRequestRoomDetails(room, field, +1)}
        >+</div>
    </div>
);

const childrenAgeChanged = (formik, room) => {
    store.setRequestRoomChildrenAges(room, formik.values.slice(0, store.getRoomDetails(room).childrenNumber));
};

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
                    value={store.search.rooms}
                />

                {[...Array(store.search.rooms)].map((x, room) => (
                    <React.Fragment>
                        {(store.search.rooms > 1) && <h3>Room {room+1} Settings</h3>}
                        <Row t={t}
                             room={room}
                             text="Adult_plural"
                             field="adultsNumber"
                             value={store.getRoomDetails(room)?.adultsNumber}
                        />
                        <Row t={t}
                            room={room}
                            text="Children"
                            field="childrenNumber"
                            value={store.getRoomDetails(room)?.childrenNumber}
                        />
                        {(store.getRoomDetails(room)?.childrenNumber > 0) &&
                            <div class="form">
                                <h4>{t("Please enter children ages")}</h4>
                                <Formik
                                    initialValues={Array(10).fill("" + defaultChildrenAge)}
                                    render={formik => (
                                        <form onSubmit={formik.handleSubmit}>
                                            <div class="row children">
                                                {[...Array(store.getRoomDetails(room)?.childrenNumber)].map((x, child) => (
                                                    <FieldText formik={formik}
                                                        id={child}
                                                        placeholder={t("Please enter")}
                                                        suggestion={plural(t, formik.values[child], "year")}
                                                        onBlur={() => childrenAgeChanged(formik, room)}
                                                        numeric
                                                        maxLength={2}
                                                    />
                                                ))}
                                            </div>
                                        </form>
                                    )}
                                />
                            </div>
                        }
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default PeopleDropdown;
