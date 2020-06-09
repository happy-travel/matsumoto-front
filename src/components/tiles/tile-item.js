import React from 'react';

import Flag from 'components/flag';
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

@observer
class TileItem extends React.Component {
    render() {
        var {
            item,
            removable = true
        } = this.props,
        { t } = useTranslation();

        return (
            <div class={"item" + __class(item.exclusive, "offer")}>
                <div class="body">
                    <div class="info">
                        <Flag code={item.flag} />
                        <div>
                            <div class="title">{item.city || item.title}</div>
                            { item.propertiesCount && <div class="count">{t("More than")} {item.propertiesCount} {t("properties")}</div> }
                        </div>
                    </div>
                    { item.minPrice && <div class="price">
                        <span>{t("From")}</span> USD {item.minPrice}
                    </div> }
                </div>
                <div class="bottom"/>
                <img class="picture" src={item.image} alt={item.title} />
                { /* todo: removable && <div class="close" /> */ }
                { item.exclusive && <div class="exclusive">
                    {t("Exclusive offer")}
                </div> }
            </div>
        );
    }
}

export default TileItem;
