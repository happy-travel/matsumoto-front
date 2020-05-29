import React from 'react';

const Image = ({ item }) => (
    item?.source ? <div class="sizer">
        <img src={item.source} alt={item.caption || ""} />
    </div> : null
);

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
                        class={"item" + (index == selected ? " selected" : "")}
                        onClick={() => this.setState({ selected: index })}
                    >
                        <Image item={pictures[index]} />
                    </div>
                ))(i * 3 + j)
            }
            thumbs.push(<div class="subthumbs">{subthumbs}</div>);
        }


        return <div class="gallery">
            <div class="big">
                <Image item={pictures[selected]} index={selected} />
            </div>
            <div class="thumbs">
                {thumbs}
            </div>
        </div>;
    }
}

export default Gallery;