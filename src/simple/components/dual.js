import React from "react";

export const Dual = ({ first, second, a, b, className, nonEmpty }) => (
    (!nonEmpty || b) ? <div className={"dual" + __class(className)}>
        <div className="first">
            { first || a }
        </div>
        <div className="second">
            { second || b }
        </div>
    </div> : null
);
