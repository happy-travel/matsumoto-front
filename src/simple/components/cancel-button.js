import React from "react";

export const CancelButton = ({ formik, className, children }) => {
    return <button className={className} onClick={(e) => {
        e.preventDefault();
        formik.resetForm();
    }}>
        {children}
    </button>
};
