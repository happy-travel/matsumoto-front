import React from "react";

export const Flag = ({ code }) => (
    code ? <span class="flag">
        <span class={"fp " + code.toLowerCase()} />
    </span> : null
);
