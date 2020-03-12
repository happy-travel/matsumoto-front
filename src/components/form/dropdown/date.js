import React from "react";
import DateRangePicker from "react-daterange-picker";
import {observer} from "mobx-react";

import UI from "stores/ui-store";

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
    render() {
        const {
            setValue,
            connected,
            options
        } = this.props;
        return (
            <div class="date dropdown">
                <DateRangePicker
                    className={"calendar-style"}
                    firstOfWeek={"rtl" == window.localStorage.getItem('direction') ? 0 : 1}
                    numberOfCalendars={2}
                    selectionType="range"
                    minimumDate={"dates" == connected ? new Date() : null}
                    stateDefinitions={stateDefinitions}
                    defaultState="available"
                    showLegend={false}
                    paginationArrowComponent={PaginationArrowComponent}
                    value={options}
                    onSelect={(...args) => {setValue(...args); UI.setOpenDropdown(null);}}
                />
            </div>
        );
    }
}

export default DateDropdown;
