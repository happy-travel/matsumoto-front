import React from "react";
import { observer } from "mobx-react";
import { FieldText } from "components/form";
import DuplicateDropdown from "./dropdown-duplicate";
import { $view, $accommodation } from "stores";

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
    var result = $accommodation.hotelArray.filter(item => item.accommodation.id != $view.modalData?.accommodation?.id);
    if (event?.target?.value)
        result = result.filter(item => checkMatch(item, event.target.value));
    $view.setDestinations(result);
};

@observer
class FieldDuplicate extends React.Component {
    componentDidMount() {
        setList();
    }

    inputChanged = (event) => {
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
                       Icon={<span className="icon icon-search-location" />}
                       Dropdown={DuplicateDropdown}
                       options={$view.destinations}
                       onChange={this.inputChanged}
                       clearable
            />
        );
    }
}

export default FieldDuplicate;
