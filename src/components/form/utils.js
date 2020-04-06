export const getValue = (formik, id) => {
    if (typeof id != "string") id = ""+id;
    if (!formik) return '';
    return id.split('.').reduce((o,i)=>o?.[i], formik.values);
};