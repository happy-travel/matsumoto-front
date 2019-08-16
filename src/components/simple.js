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
