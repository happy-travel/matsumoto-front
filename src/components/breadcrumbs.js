import React from 'react';
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [], noBackButton }) => (
    <div class="breadcrumbs">
        { items.map((item, index) => (
            <React.Fragment>
                { item.link ?

                    <Link to={item.link}>
                        {item.text}
                    </Link> :

                    item.text
                }
                { index+1 < items.length ? <span class="small-arrow-right" /> : ' '}
                {' '}
            </React.Fragment>
        )) }
        { !noBackButton && <div class="back-button"><span class="small-arrow-left" /> {t('Back')}</div>}
    </div>
);

export default Breadcrumbs;
