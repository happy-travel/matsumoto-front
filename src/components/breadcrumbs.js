import React from "react";
import { useTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";

const Breadcrumbs = ({
    items = [],
    noBackButton,
    history,
    backLink,
    backText
}) => {
    var { t } = useTranslation();

    if (!backText)
        backText = t('Back');

    return (
        <div className="breadcrumbs">
            { !!items.length &&
                <div className="links">
                    { items.map((item, index) => (
                        <React.Fragment key={index}>
                            { item.link ?
                                <Link to={item.link}>
                                    {item.text}
                                </Link>
                              :
                                item.text
                            }
                            { index+1 < items.length ? <span className="small-arrow-right" /> : ' '}
                            {' '}
                        </React.Fragment>
                    ))}
                </div>
            }
            { !noBackButton && (
                backLink ?
                    <Link to={backLink}>
                        <span className="back-button">
                            <span className="small-arrow-left" />{backText}
                        </span>
                    </Link> :
                    <div onClick={() => history.goBack()} className="back-button">
                        <span className="small-arrow-left" />{backText}
                    </div>
            )}
        </div>
    );
};

export default withRouter(Breadcrumbs);
