import React from "react";
import { useTranslation } from "react-i18next";

import PrivacyEn from './en/privacy';
import PrivacyAr from './ar/privacy';

const components = {
    en: PrivacyEn,
    ar: PrivacyAr
};

export default () => {
    const { t, i18n } = useTranslation();
    const Component = components[i18n.language];
    return <Component />;
};
