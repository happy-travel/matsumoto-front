import React from "react";
import DayPicker from 'react-day-picker';
import { observer } from "mobx-react";
import localeUtils from "tasks/utils/date-locale-utils";
import View from "stores/view-store";
import authStore from "stores/auth-store";

@observer
class DateDropdown extends React.Component {
    constructor(props) {
        super(props);

        const { options } = this.props;
        const [from, to] = options;
        this.state = {
            from,
            to
        };
    }

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
            View.setOpenDropdown(null);
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
                    fromMonth={new Date()}
                    initialMonth={from}
                    disabledDays={"dates" == connected ? {
                        before: new Date(),
                    } : []}
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
                        ...(authStore.settings.weekStarts ? {
                            firstDayOfWeek: authStore.settings.weekStarts % 7
                        } : {})
                    }
                />
            </div>
        );
    }
}

export default DateDropdown;
