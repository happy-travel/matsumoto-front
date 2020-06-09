import React from 'react';

const Picture = ({ item, big }) => {
    if (!item?.source)
        return null;

    if (big) {
        var cover = false,
            img = new Image();
        img.src = item.source;

        if (img.width && img.height && (img.width > img.height) && (img.width < 3 * img.height))
            cover = true;
    }

    return (
        <div class={"sizer" + __class(big, "big") + __class(cover, "cover")}>
            <img src={item.source} alt={item.caption || ""} />
        </div>
    );
};

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        };
    }

    render() {
        var { pictures } = this.props,
            { selected } = this.state;

        if (!pictures || !pictures.length)
            return null;

        var thumbs = [];
        for (var i = 0; i < pictures.length / 3; i++) {
            var subthumbs = [];
            for (var j = 0; j < 3 && i * 3 + j < pictures.length; j++) {
                (index => subthumbs.push(
                    <div
                        class={"item" + __class(index == selected, "selected")}
                        onClick={() => this.setState({ selected: index })}
                    >
                        <Picture item={pictures[index]} />
                    </div>
                ))(i * 3 + j)
            }
            thumbs.push(<div class="subthumbs">{subthumbs}</div>);
        }

        return <div class="gallery">
            <div class="big">
                <Picture big item={pictures[selected]} index={selected} />
            </div>
            { (pictures.length > 1) && <div class={"thumbs" + __class(pictures.length >= 12, "scroll")}>
                {thumbs}
            </div> }
        </div>;
    }
}

export default Gallery;