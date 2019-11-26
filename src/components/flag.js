import React from "react";

const Flag = ({ code }) => (
    <span class="flag">
        <span class={"fp " + code.toLowerCase()} />
    </span>
);

export default Flag;
