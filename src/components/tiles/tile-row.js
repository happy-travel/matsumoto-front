import React from 'react';

import TileItem from './tile-item';

const Tiles = class extends React.Component {

    render() {
        var {
            list
        } = this.props;

        if (!list || !list.length)
            return <div/>;

        return (
            <div class={"tile-row x-" + list.length}>
                {list.map(item =>
                    <TileItem
                        key={"temp-remove-" + Math.random()}
                        item={item}
                        removable={ item.exclusive !== true }
                    />
                )}
            </div>
        );
    }
};

export default Tiles;
