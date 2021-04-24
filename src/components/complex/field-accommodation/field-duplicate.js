import React, { useState, useEffect } from "react";
import { FieldText } from "components/form";
import DuplicateDropdown from "./dropdown-duplicate";
import { $accommodation, $view } from "stores";

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

const FieldDuplicate = ({
    formik,
    id,
    label,
    placeholder,
}) => {
    const [destinationsList, setDestinationsList] = useState([]);

    useEffect(() => {
        setList();
    }, []);

    const inputChanged = (event) => {
        formik.setFieldValue("id", null);
        setList(event);
    };

    const setList = event => {
        let result = $accommodation.hotelArray.filter(item => item.accommodation.id != $view.modalData?.accommodation?.id);
        if (event?.target?.value)
            result = result.filter(item => checkMatch(item, event.target.value));
        setDestinationsList(result);
    };

    const setValue = (item) => {
        setTimeout(() => {
            formik.setFieldValue("source", item.supplier);
            formik.setFieldValue("name", item.accommodation.name);
            formik.setFieldValue("id", item.accommodation.id);
        }, 0);
    };

    return (
        <FieldText
            formik={formik}
            id={id}
            label={label}
            additionalFieldForValidation="id"
            placeholder={placeholder}
            Icon={<span className="icon icon-search-location" />}
            Dropdown={DuplicateDropdown}
            options={destinationsList}
            onChange={inputChanged}
            setValue={setValue}
            clearable
        />
    );
};

export default FieldDuplicate;
