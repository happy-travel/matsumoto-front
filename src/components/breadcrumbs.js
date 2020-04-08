import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

const Breadcrumbs = ({ items = [], noBackButton, history }) => {
    var { t } = useTranslation();

    return (
        <div class="breadcrumbs">
            { items.map((item, index) => (
                <React.Fragment>
                    { item.link ?
                        <Link to={item.link}>
                            {item.text}
                        </Link>
                      :
                      item.onClick ?
                        <span onClick={item.onClick} class="breadcrumbs--link">{item.text}</span>
                        :
                        item.text
                    }
                    { index+1 < items.length ? <span class="small-arrow-right" /> : ' '}
                    {' '}
                </React.Fragment>
            )) }
            {!noBackButton && <div onClick={() => history.goBack()} class="back-button breadcrumbs--link"><span class="small-arrow-left" /> {t('Back')}</div>}
        </div>
    );
};

export default withRouter(Breadcrumbs);
