import React from 'react';

export const Dual = ({ first, second, a, b }) => (
    <div class="dual">
        <div class="first">
            { first || a }
        </div>
        <div class="second">
            { second || b }
        </div>
    </div>
);
