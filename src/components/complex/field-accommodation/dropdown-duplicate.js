import React from "react";
import { observer } from "mobx-react";
import { Highlighted } from "simple";
import { HotelStars } from "components/accommodation";
import { $view } from "stores";

@observer
class DestinationDropdown extends React.Component {
    setValue = (item) => {
        const { formik } = this.props;

        $view.setDestinations([]);
        setTimeout(() => {
            formik.setFieldValue("source", item.supplier);
            formik.setFieldValue("name", item.accommodation.name);
            formik.setFieldValue("id", item.accommodation.id);
        }, 0);
    };

    render() {
        const { focusIndex, connected } = this.props;

        if (!$view?.destinations.length)
            return null;

        return (
            <div className="dropdown" id={connected}>
                <div className="scroll">
                    { $view?.destinations?.map((item, index) => (
                        <div key={index}>
                            <div
                                id={`${connected}-${index}`}
                                className={"line summary" + __class(focusIndex === index, "focused")}
                                onClick={() => this.setValue(item)}
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
                                        <Highlighted str={item.accommodation.name} highlight={this.props.value} />
                                        <HotelStars count={item.accommodation.rating} />
                                    </h2>
                                    <div className="category">
                                        <Highlighted str={
                                            item.accommodation.location.locality + ", " + item.accommodation.location.address
                                        } highlight={this.props.value} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default DestinationDropdown;
