import React from "react";
import { Flag } from "components/simple";

const FieldSelectDropdown = ({
    setValue,
    options,
    focusIndex
}) => {
    return (
        <div className="select dropdown">
            <div className="scroll">
                {options?.map((item, index) => (
                    <div
                        onClick={() => setValue(item)}
                        className={"line" + __class(focusIndex === index, "focused")}
                        key={index}
                    >
                        {item.flag && <Flag code={item.flag} /> }
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FieldSelectDropdown;
