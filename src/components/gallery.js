import React, {useState} from 'react';
import { Carousel } from "components/external/react-responsive-carousel";

export default function (props) {
    const {data} = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    function onChange(e) {
        setCurrentIndex(e);
    }
    return <div className="gallery">
        <Carousel
            selectedItem={currentIndex}
            onChange={onChange}
            showIndicators={false}
            showArrows={false}
            showStatus={false}
            transitionTime={200}
        >{props.children}</Carousel>
       {data && <div className="gallery__bar">
            <div className="gallery__bar__filled" style={{width: `${((currentIndex + 1) / data.length) * 100}%`}}/>
        </div>}
    </div>
}
