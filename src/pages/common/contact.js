import React from "react";
import { useTranslation } from "react-i18next";

import ContactEn from './en/contact';
import ContactAr from './ar/contact';

const components = {
    en: ContactEn,
    ar: ContactAr
};

export default () => {
    const { t, i18n } = useTranslation();
    const Component = components[i18n.language];
    return <Component />;
};
