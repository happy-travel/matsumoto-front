import React from 'react';
import DateRangePicker from 'react-daterange-picker';
import {observer} from "mobx-react";
import store from 'stores/accommodation-store';
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

const PaginationArrowComponent = (props) => {
    const {direction, onTrigger, disabled} = props;
    return <button
        class={`calendar-style__arrows calendar-style__arrow__${direction}`}
        onClick={(e) => {e.preventDefault(); onTrigger(e)}}
        disabled={disabled}
    >
        {direction === 'previous' ? <span>&#8249;</span> : <span>&#8250;</span>}
    </button>;
};

@observer
class DateDropdown extends React.Component {
    handleSelect(range) {
        store.setDateRange({
            start: moment(range.start).add(1, 'd'),
            end: moment(range.end).add(1, 'd')
        });
    }

    render() {
        return (
            <div class="date dropdown">
                <DateRangePicker
                    className={"calendar-style"}
                    firstOfWeek={1}
                    numberOfCalendars={2}
                    selectionType='range'
                    minimumDate={new Date()}
                    stateDefinitions={stateDefinitions}
                    defaultState="available"
                    showLegend={false}
                    value={moment.range(
                        moment(store.search.request.checkInDate).local().startOf('day'),
                        moment(store.search.request.checkOutDate).local().endOf('day')
                    )}
                    onSelect={this.handleSelect}
                    paginationArrowComponent={PaginationArrowComponent}
                />
            </div>
        );
    }
}

export default DateDropdown;
