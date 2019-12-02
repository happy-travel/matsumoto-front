import React from "react";

const Flag = ({ code }) => (
    code ? <span class="flag">
        <span class={"fp " + code.toLowerCase()} />
    </span> : null
);

export default Flag;
