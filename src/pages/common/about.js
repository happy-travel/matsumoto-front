import React from "react";
import { useTranslation } from "react-i18next";

import AboutEn from './en/about';
import AboutAr from './ar/about';

const components = {
    en: AboutEn,
    ar: AboutAr
};

export default () => {
    const { t, i18n } = useTranslation();
    const Component = components[i18n.language];
    return <Component />;
};
