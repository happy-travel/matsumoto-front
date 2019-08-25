import React from "react";
import { hotelStars } from "core";

export const Dual = ({ first, second, a, b, addClass }) => (
    <div class={"dual" + (addClass ? " " + addClass : '')}>
        <div class="first">
            { first || a }
        </div>
        <div class="second">
            { second || b }
        </div>
    </div>
);

export const Highlighted = ({ str, highlight }) => (
    highlight ?
        <span dangerouslySetInnerHTML={
            {__html: str?.replace?.(new RegExp(highlight, 'gi'), (s) => ("<b>"+ s +"</b>"))}
    } /> : <span>{str}</span>
);

export const Stars = ({ count }) => {
    var result = hotelStars.indexOf(count);
    if (count >= 1) result = count;
    if (result < 1) return null;

    return (
        <span class="stars">
            {[...Array(result)].map(() => <i/>)}
        </span>
    );
};
