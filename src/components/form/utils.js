export const getValue = (formik, id) => {
    if (typeof id != "string") id = ""+id;
    if (!formik) return '';
    var value = id.split('.').reduce((o,i)=>o?.[i], formik.values);
    if (0 === value)
        value = "0";
    return value;
};