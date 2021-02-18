import React from "react";

export const Loader = ({ page, segment, white }) => (
    <div className={"loader" + __class(page || segment, "full-page") + __class(white, "white") + __class(segment, "segment")}>
        <div className="x"><div className="a" /><div className="b" /><div /></div>
    </div>
);
