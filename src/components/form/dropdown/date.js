import React from 'react';
import DateRangePicker from 'react-daterange-picker';
import {observer} from "mobx-react";
import AccommodationStore from 'stores/accommodation-store';
import moment from "moment";

const stateDefinitions = {
    available: {
        color: null,
        label: 'Available'
    },
    enquire: {
        color: '#ffd200',
        label: 'Enquire'
    },
    unavailable: {
        selectable: false,
        color: '#78818b',
        label: 'Unavailable'
    }
};

@observer
class DateDropdown extends React.Component {
    handleSelect(range) {
        AccommodationStore.setDateRange({
            start: moment(range.start).add(1, 'd'),
            end: moment(range.end).add(1, 'd')
        });
    }

    render() {
        var store = AccommodationStore;

        return (
            <div class="date dropdown">
                <DateRangePicker
                    class={"calendar-style"}
                    firstOfWeek={1}
                    numberOfCalendars={2}
                    selectionType='range'
                    minimumDate={new Date('2012-01-01T00:00:00.000Z')}
                    stateDefinitions={stateDefinitions}
                    defaultState="available"
                    showLegend={false}
                    value={moment.range(
                        moment(store.search.request.checkInDate).local().startOf('day'),
                        moment(store.search.request.checkOutDate).local().endOf('day')
                    )}
                    onSelect={this.handleSelect}
                />
            </div>
        );
    }
}

export default DateDropdown;
