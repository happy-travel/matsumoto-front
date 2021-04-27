import React from "react";
import { Flag } from "components/simple";
import { useTranslation } from "react-i18next";

const TileItem = ({ item }) => {
    const { t } = useTranslation();
    return (
        <div className={"item" + __class(item.exclusive, "offer")}>
            <div className="body">
                <div className="info">
                    <Flag code={item.flag} />
                    <div>
                        <div className="title">{item.city || item.title}</div>
                        { item.propertiesCount && <div className="count">{t("More than")} {item.propertiesCount} {t("properties")}</div> }
                    </div>
                </div>
                { item.minPrice && <div className="price">
                    <span>{t("From")}</span> USD {item.minPrice}
                </div> }
            </div>
            <div className="bottom"/>
            <img className="picture" src={item.image} alt={item.title} />
        </div>
    );
};

export default TileItem;
