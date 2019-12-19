import React from "react";
import { useTranslation } from "react-i18next";

import TermsEn from './en/terms';
import TermsAr from './ar/terms';

const components = {
    en: TermsEn,
    ar: TermsAr
};

export default () => {
    const { t, i18n } = useTranslation();
    const Component = components[i18n.language];
    return <Component />;
};
