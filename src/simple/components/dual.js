import React from "react";

export const Dual = ({ first, second, a, b, addClass, nonEmpty }) => (
    (!nonEmpty || b) ? <div class={"dual" + __class(addClass)}>
        <div class="first">
            { first || a }
        </div>
        <div class="second">
            { second || b }
        </div>
    </div> : null
);
