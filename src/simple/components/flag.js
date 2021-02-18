import React from "react";

export const Flag = ({ code, language }) => {
    if (language) {
        if (language == "en")
            code = "gb";
        if (language == "ar")
            code = "ae";
    }

    if (!code)
        return null;

    return (
        <span className="flag">
            <span className={"fp " + code.toLowerCase()}/>
        </span>
    );
};
