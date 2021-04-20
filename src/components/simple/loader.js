import React from "react";

const Loader = ({ page, segment, white }) => (
    <div className={"loader" + __class(page || segment, "full-page") + __class(white, "white") + __class(segment, "segment")}>
        <div className="inside">
            <span /><span /><span /><span /><span /><span /><span />
        </div>
    </div>
);

export default Loader;
