import React, { useState, useEffect } from "react";
import DayPicker from "react-day-picker";
import localeUtils from "tasks/utils/date-locale-utils";
import { $personal } from "stores";

const DateDropdown = ({
    close,
    options,
    setValue,
    connected
}) => {
    const [state, setState] = useState({});

    useEffect(() => {
        setState({
            from: options[0],
            to: options[1]
        });
    }, [options]);

    const setDays = (result) => {
        if (result.to && (result.from > result.to))
            result = {
                to: result.from,
                from: result.to
            };
        setState(result);
        return [result.from, result.to];
    };

    const handleDayClick = (day, modifiers) => {
        if (modifiers.disabled)
            return;

        const { from, to } = state;

        if (from && !to) {
            if (modifiers.start)
                return;
            setValue(setDays({
                from,
                to: day
            }));
            close();
            return;
        }
        setDays({
            from: day,
            to: null
        });
    };

    const { from, to } = state;

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
                onDayClick={handleDayClick}
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
};

export default DateDropdown;
