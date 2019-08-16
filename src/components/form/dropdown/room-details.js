import React from 'react';
import {observer} from "mobx-react";
import AccommodationStore from 'stores/accommodation-store';

@observer
class PeopleDropdown extends React.Component {

    render() {
        var {
        } = this.props;

        const store = AccommodationStore;
        return (
            <div class="people dropdown">
                <div class="row">
                    <div class="caption">
                        Adults
                    </div>
                    <div class="btn" onClick={() => store.setRequestAdults(-1)}>
                        –
                    </div>
                    <div class="value">
                        {store.request.roomDetails[0].adultsNumber}
                    </div>
                    <div class="btn" onClick={() => store.setRequestAdults(1)}>
                        +
                    </div>
                </div>
                <div class="row">
                    <div class="caption">
                        Children
                    </div>
                    <div class="btn" onClick={() => store.setRequestChildren(-1)}>
                        –
                    </div>
                    <div class="value">
                        {store.request.roomDetails[0].childrenNumber}
                    </div>
                    <div class="btn" onClick={() => store.setRequestChildren(1)}>
                        +
                    </div>
                </div>
                <div class="row">
                    <div class="caption">
                        Rooms
                    </div>
                    <div class="btn" onClick={() => store.setRequestRooms(-1)}>
                        –
                    </div>
                    <div class="value">
                        {store.request.roomDetails[0].rooms}
                    </div>
                    <div class="btn" onClick={() => store.setRequestRooms(1)}>
                        +
                    </div>
                </div>
            </div>
        );
    }
}

export default PeopleDropdown;
