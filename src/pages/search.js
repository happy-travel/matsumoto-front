import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import Search from 'components/search';

const scnd = () => {
    const { t, i18n } = useTranslation();

    return (
        <React.Fragment>
            <Search />
            <div class="tiles block">
                <section>

                </section>
            </div>
        </React.Fragment>
    );
};

export default scnd;
