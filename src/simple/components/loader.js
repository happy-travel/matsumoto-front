import React from "react";

export const Loader = ({ page, segment, white }) => (
    <div class={"loader" + __class(page || segment, "full-page") + __class(white, "white") + __class(segment, "segment")}>
        <div class="x"><div class="a" /><div class="b" /><div /></div>
    </div>
);
