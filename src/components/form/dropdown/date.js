import React from 'react';
import DateRangePicker from 'react-daterange-picker';
import {observer} from "mobx-react";
import SearchStore from 'stores/search-store';

const stateDefinitions = {
    available: {
        color: null,
        label: 'Available',
    },
    enquire: {
        color: '#ffd200',
        label: 'Enquire',
    },
    unavailable: {
        selectable: false,
        color: '#78818b',
        label: 'Unavailable',
    },
};

@observer
class DateDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
            }
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(range) {

        const store = SearchStore;
        var start = new Date(range.start);
        var end = new Date(range.end);

        start.setHours(4);
        end.setHours(4); //todo: repair and remove
        this.setState({
            value: range
        });
        store.setDateRange({
            start: start.toISOString(),
            end: end.toISOString(),
        });
    }

    render() {
        var {
        } = this.props;

        return (
            <div class="date dropdown">
                <DateRangePicker
                className={"calendar-style"}
                firstOfWeek={1}
                numberOfCalendars={2}
                selectionType='range'
                minimumDate={new Date('2000-01-01T00:00:00.000Z')}
                stateDefinitions={stateDefinitions}
                defaultState="available"
                showLegend={false}
                value={this.state.value}
                onSelect={this.handleSelect} />
            </div>
        );
    }
}

export default DateDropdown;
