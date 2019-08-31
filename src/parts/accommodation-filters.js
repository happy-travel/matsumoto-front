import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import {
    FieldCheckbox,
    FieldRange
} from "components/form";
import { Expandable } from "components/simple";

@observer
class AccommodationFiltersPart extends React.Component {
    render() {
        const { t } = useTranslation();

        return (
            <div class="left-section filters">
                { /* todo:
                <div class="static item">{t("Map")}</div>
                <div class="expanded">
                    <img src="/images/temporary/map.png" alt=""/>
                </div>
                */ }
                <Expandable
                    open
                    header={t("Price Range")}
                    content={
                        <div class="expanded price-range">
                            <h4>{t("Drag the slider to choose the minimum and maximum price")}</h4>
                            <FieldRange
                                min={null}
                                max={null}
                            />
                        </div>
                    }
                />
                <Expandable
                    header={t("Property Type")}
                    content={
                        <div class="expanded">
                        </div>
                    }
                />
                <Expandable
                    open
                    header={t("Rating")}
                    content={
                        <div class="expanded">
                            <FieldCheckbox
                                label={<div>{t("Preferred")} <span>(1)</span></div>}
                            />
                            <FieldCheckbox
                                label={<div>{t("5 stars")} <span>(5)</span></div>}
                            />
                        </div>
                    }
                />
                <Expandable
                    open
                    header={t("Board Basis")}
                    content={
                        <div class="expanded">
                            <FieldCheckbox
                                label={t("Room Only")}
                            />
                            <FieldCheckbox
                                label={t("Breakfast")}
                            />
                        </div>
                    }
                />
                <Expandable
                    open
                    header={t("Rate Type")}
                    content={
                        <div class="expanded">
                            <FieldCheckbox
                                label={t("Flexible")}
                                value={true}
                            />
                        </div>
                    }
                />
                { /* todo:
                <Expandable header={t("Hotel Amenities")} />
                <Expandable header={t("Geo Location")} />
                <Expandable header={t("Leisure & Sport")} />
                <Expandable header={t("Business Features")} />
                <Expandable header={t("Hotel Chain")} />
                */ }
            </div>
        );
    }
}

export default AccommodationFiltersPart;
