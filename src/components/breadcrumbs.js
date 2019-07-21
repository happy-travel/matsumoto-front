import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [], noBackButton }) => {
    var { t } = useTranslation();

    return (
        <div class="breadcrumbs">
            { items.map((item, index) => (
                <React.Fragment>
                    { item.link ?
                        <Link to={item.link}>
                            {t(item.text)}
                        </Link> :

                        t(item.text)
                    }
                    { index+1 < items.length ? <span class="small-arrow-right" /> : ' '}
                    {' '}
                </React.Fragment>
            )) }
            { !noBackButton && <div class="back-button"><span class="small-arrow-left" /> {t('Back')}</div>}
        </div>
    );
};

export default Breadcrumbs;
