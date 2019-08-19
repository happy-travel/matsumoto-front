import React from 'react';

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

export const Highlighted = ({str, highlight}) => (
    highlight ?
        <span dangerouslySetInnerHTML={
            {__html: str?.replace?.(new RegExp(highlight, 'gi'), (s) => ("<b>"+ s +"</b>"))}
    } /> : <span>{str}</span>
);
