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
            formik.setFieldValue("source", item.dataProvider);
            formik.setFieldValue("name", item.accommodation.name);
            formik.setFieldValue("id", item.accommodation.id);
        }, 1);
    }

    render() {
        const { focusIndex } = this.props;

        return (
            <div class="region dropdown">
                <div class="scroll">
                    {View?.destinations?.map((item, index) => (
                        <div class="variants">
                            <div id={`js-value-${index}`}
                                 class={"country line summary" + __class(focusIndex === index, "focused")}
                                 onClick={() => this.setValue(item)}>
                                { item.accommodation.picture.source && <div class="photo">
                                    <img src={item.accommodation.picture.source} alt="" />
                                </div> }
                                <div class="title">
                                    <h2>
                                        <Highlighted str={item.accommodation.name} highlight={this.props.value} />
                                        <Stars count={item.accommodation.rating} />
                                    </h2>
                                    <div class="category">
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
