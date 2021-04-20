import React from "react";
import DayPicker from 'react-day-picker';
import { observer } from "mobx-react";
import localeUtils from "tasks/utils/date-locale-utils";
import { $view, $personal } from "stores";

@observer
class DateDropdown extends React.Component {
    state = {
        from: this.props.options[0],
        to: this.props.options[0]
    };

    setDays = (result) => {
        if (result.to && (result.from > result.to))
            result = {
                to: result.from,
                from: result.to
            };
        this.setState(result);
        return [result.from, result.to];
    };

    handleDayClick = (day, modifiers) => {
        if (modifiers.disabled)
            return;

        const { setValue } = this.props;
        const { from, to } = this.state;

        if (from && !to) {
            if (modifiers.start)
                return;
            setValue(this.setDays({
                from,
                to: day
            }));
            $view.setOpenDropdown(null);
            return;
        }
        this.setDays({
            from: day,
            to: null
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const [ propsFrom, propsTo ] = this.props.options;
        const [ prevPropsFrom, prevPropsTo ] = prevProps.options;
        if (propsFrom != prevPropsFrom || propsTo != prevPropsTo)
            this.setState({
                from: propsFrom,
                to: propsTo
            })
    }

    render() {
        const {
            setValue,
            connected,
            options
        } = this.props;
        const { from, to } = this.state;

        return (
            <div className="date dropdown">
                <DayPicker
                    localeUtils={localeUtils}
                    numberOfMonths={2}
                    fromMonth={
                        "dates" == connected ?
                            new Date() :
                            new Date("2019-01-01")
                    }
                    initialMonth={from}
                    disabledDays={
                        "dates" == connected ?
                        {
                            before: new Date()
                        } :
                        []
                    }
                    selectedDays={[from, { from, to }]}
                    onDayClick={this.handleDayClick}
                    modifiers={{
                        start: from,
                        end: to,
                        only: !to && from
                    }}
                    renderDay={(day) => (
                        <div>
                            {day.getDate()}
                        </div>
                    )}
                    {
                        ...($personal.settings.weekStarts ? {
                            firstDayOfWeek: $personal.settings.weekStarts % 7
                        } : {})
                    }
                />
            </div>
        );
    }
}

export default DateDropdown;
