import React from 'react';

import Flag from 'components/flag';

const TileItem = class extends React.Component {

    render() {
        var {
            item,
            removable = true
        } = this.props;

        item.url = item.url || '#';

        return (
            <div class={'item' + (item.exclusive ? ' offer' : '')}>
                <a class="body" href={item.url}>
                    <div class="info">
                        <Flag code={ item.flag } />
                        <div>
                            <div class="title">{item.city || item.title}</div>
                            { item.propertiesCount && <div class="count">{item.propertiesCount} properties</div> }
                        </div>
                    </div>
                    { item.minPrice && <div class="price">
                        <span>From</span> USD {item.minPrice}
                    </div> }
                </a>
                <div class="bottom"/>
                <img class="picture" src={item.image} alt={item.title} />
                { /* todo: removable && <div class="close" /> */ }
                { item.exclusive && <div class="exclusive">
                    Exclusive offer
                </div> }
            </div>
        );
    }
};

export default TileItem;
