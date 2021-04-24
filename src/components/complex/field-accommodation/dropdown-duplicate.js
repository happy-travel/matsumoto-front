import React from "react";
import { Highlighted } from "simple";
import { HotelStars } from "components/accommodation";

const DuplicateDropdown = ({
    setValue,
    focusIndex,
    connected,
    options,
    value
}) => {
    if (!options.length)
        return null;

    return (
        <div className="dropdown" id={connected}>
            <div className="scroll">
                { options.map((item, index) => (
                    <div key={index}>
                        <div
                            className={"line summary" + __class(focusIndex === index, "focused")}
                            onClick={() => setValue(item)}
                        >
                            <div
                                className="photo"
                                style={ item.accommodation.photo.sourceUrl ?
                                    { backgroundImage: `url(${item.accommodation.photo.sourceUrl})`} :
                                    null
                                }
                            />
                            <div className="title">
                                <h2>
                                    <Highlighted str={item.accommodation.name} highlight={value} />
                                    <HotelStars count={item.accommodation.rating} />
                                </h2>
                                <div className="category">
                                    <Highlighted
                                        str={item.accommodation.location.locality + ", " + item.accommodation.location.address}
                                        highlight={value}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DuplicateDropdown;
