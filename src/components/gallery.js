import React, { useState } from "react";

const Picture = ({ item, index }) => {
    if (!item?.sourceUrl)
        return null;

    return (
        <div
            className="sizer"
            style={{ backgroundImage: `url(${item.sourceUrl})` }}
        />
    );
};

const Gallery = ({ pictures }) => {
    const [selected, setSelected] = useState(0);

        if (!pictures?.length)
            return null;

        return (
            <div className="gallery">
                <div className="big">
                    <Picture big item={pictures[selected]} index={selected} />
                </div>
                { (pictures.length > 1) &&
                    <div className={"thumbs" + __class(pictures.length >= 4, "scroll")}>
                        { pictures.map((item, index) => (
                            <div
                                className="item"
                                onClick={() => setSelected(index)}
                                key={index}
                            >
                                <Picture item={pictures[index]} index={index}/>
                            </div>
                        ))}
                    </div>
                }
                <div className="corner">
                    <div />
                </div>
            </div>
        );
};

export default Gallery;
