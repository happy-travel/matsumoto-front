import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DuplicateDropdown from "./dropdown-duplicate";

import View from "stores/view-store";
import store from "stores/accommodation-store";

const checkMatch = (accommodation , value) => {
    var str = [
        accommodation.accommodation.name,
        accommodation.accommodation.location.locality,
        accommodation.accommodation.location.address
    ].join(" ");

    var highlight = value.trim().replace(/[\W_]+/g," ").split(' ');

    for (var i = 0; i < highlight.length; i++)
        if (highlight[i])
            if (str != str.replace(new RegExp(highlight[i], 'gi'), (s) => ("?")))
                return true;

    return false;
};

const setList = event => {
    var result = store.hotelArray.filter(item => item.accommodation.id != View.modalData?.accommodation?.id);
    if (event?.target?.value)
        result = result.filter(item => checkMatch(item, event.target.value));
    View.setDestinations(result);
};

@observer
class FieldDuplicate extends React.Component {
    constructor(props) {
        super(props);
        this.inputChanged = this.inputChanged.bind(this);
    }

    componentDidMount() {
        setList();
    }

    inputChanged(event) {
        this.props.formik.setFieldValue("id", null);
        setList(event);
    };

    render() {
        const {
            formik,
            id,
            label,
            placeholder,
        } = this.props;

        return (
            <FieldText formik={formik}
                       id={id}
                       label={label}
                       additionalFieldForValidation="id"
                       placeholder={placeholder}
                       Icon={<span className="icon icon-hotel" />}
                       Dropdown={DuplicateDropdown}
                       options={View.destinations}
                       onChange={this.inputChanged}
                       clearable
            />
        );
    }
}

export default FieldDuplicate;
