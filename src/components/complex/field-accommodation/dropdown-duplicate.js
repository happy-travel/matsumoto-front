import React from "react";
import { observer } from "mobx-react";
import { Highlighted, Stars } from "simple";

import View from "stores/view-store";

@observer
class DestinationDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
    }

    setValue(item) {
        const { formik } = this.props;

        View.setDestinations([]);
        setTimeout(() => {
            formik.setFieldValue("source", item.supplier);
            formik.setFieldValue("name", item.accommodation.name);
            formik.setFieldValue("id", item.accommodation.id);
        }, 1);
    }

    render() {
        const { focusIndex } = this.props;

        return (
            <div className="region dropdown">
                <div className="scroll">
                    {View?.destinations?.map((item, index) => (
                        <div className="search-results" key={index}>
                            <div id={`js-value-${index}`}
                                 className={"country line summary" + __class(focusIndex === index, "focused")}
                                 onClick={() => this.setValue(item)}>
                                { item.accommodation.photo.sourceUrl && <div className="photo">
                                    <img src={item.accommodation.photo.sourceUrl} alt={item.accommodation.photo.caption} />
                                </div> }
                                <div className="title">
                                    <h2>
                                        <Highlighted str={item.accommodation.name} highlight={this.props.value} />
                                        <Stars count={item.accommodation.rating} />
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
