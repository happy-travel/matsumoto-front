import React from 'react';
import DateRangePicker from 'react-daterange-picker';
import {observer} from "mobx-react";

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
    render() {
        const {
            setValue,
            connected,
            options
        } = this.props;
        return (
            <div class="date dropdown">
                <DateRangePicker
                    class={"calendar-style"}
                    firstOfWeek={1}
                    numberOfCalendars={2}
                    selectionType='range'
                    minimumDate={"dates" == connected ? new Date() : null}
                    stateDefinitions={stateDefinitions}
                    defaultState="available"
                    showLegend={false}
                    value={options}
                    onSelect={setValue}
                />
            </div>
        );
    }
}

export default DateDropdown;
