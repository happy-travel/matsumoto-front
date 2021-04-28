import React from "react";
import TileItem from "./tile-item";

const Tiles = ({ list }) => (
    <div className={"tile-row x-" + list.length}>
        {list.map((item, index) =>
            <TileItem
                item={item}
                removable={item.exclusive !== true}
                key={index}
            />
        )}
    </div>
);

export default Tiles;
