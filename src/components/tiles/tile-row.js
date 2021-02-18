import React from "react";
import TileItem from "./tile-item";

const Tiles = class extends React.Component {
    render() {
        var {
            list
        } = this.props;

        if (!list || !list.length)
            return <div/>;

        return (
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
    }
};

export default Tiles;
