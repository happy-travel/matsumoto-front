import React from "react";
import DayPicker from 'react-day-picker';
import { observer } from "mobx-react";
import { windowLocalStorage } from "core/misc/window-storage";

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

    handleDayClick = (day) => {
        const { setValue } = this.props;
        const { from, to } = this.state;

        if (from && !to) {
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
                    numberOfMonths={2}
                    firstDayOfWeek={
                        authStore.settings.weekStarts
                            ? (authStore.settings.weekStarts % 7)
                            : ("ar" == windowLocalStorage.get("locale")
                                    ? 0
                                    : 1
                    )}
                    fromMonth={new Date()}
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
                    captionElement={({ date, localeUtils }) => (
                        <div className="DayPicker-Caption">
                            {localeUtils.getMonths("en")[date.getMonth()]}
                            { date.getFullYear() !== new Date().getFullYear() &&
                                " " + date.getFullYear()
                            }
                        </div>
                    )}
                    renderDay={(day) => (
                        <div>
                            {day.getDate()}
                        </div>
                    )}
                />
            </div>
        );
    }
}

export default DateDropdown;
