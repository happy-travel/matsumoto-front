import React from "react";

export const Loader = ({ page, white }) => (
    <div class={"loader" + __class(page, "full-page") + __class(white, "white")}>
        <div class="x"><div class="a" /><div class="b" /><div /></div>
    </div>
);
