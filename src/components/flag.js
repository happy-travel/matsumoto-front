import React from 'react';

const TileItem = class extends React.Component {

    render() {
        var {
            id
        } = this.props;

        return (
            <span class="flag">
                <img src={ "/images/flags/" + ( id ? id : "UA" ) + ".svg" } alt="" />
            </span>
        );
    }
};

export default TileItem;
