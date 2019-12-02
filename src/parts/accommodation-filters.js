import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import {
    FieldCheckbox,
    FieldRange
} from "components/form";
import { Expandable } from "components/simple";

import store from "stores/accommodation-store";
import { Formik } from "formik";
import { hotelStars } from "core";

@observer
class AccommodationFiltersPart extends React.Component {
    render() {
        const { t } = useTranslation();

        if (!store.filters)
            return <div class="left-section filters" />;

        return (
            <Formik
                initialValues={{

                }}
                render={formik => {
                    store.setSelectedFilters(formik.values);
                    return (
                        <form onSubmit={formik.handleSubmit}>
                            <div class="left-section filters">
                                { store.filters.price.min != store.filters.price.max &&
                                  store.filters.price.max < Infinity && <Expandable
                                    open
                                    header={t("Price Range")}
                                    content={
                                        <div class="expanded price-range">
                                            <h4>{t("Drag the slider to choose the minimum and maximum price")}</h4>
                                            <FieldRange formik={formik}
                                                min={store.filters.price.min}
                                                max={store.filters.price.max}
                                                currency={store.filters.price.currency}
                                                id="price"
                                            />
                                        </div>
                                    }
                                /> }
                                { store.filters.ratings.length && <Expandable
                                    open
                                    header={t("Rating")}
                                    content={
                                        <div class="expanded">
                                            { hotelStars.map((item, i) => (
                                                <React.Fragment>
                                                    { store.filters.ratings.indexOf(item) > -1 && <FieldCheckbox formik={formik}
                                                        label={<div>{t(i + " star" + (i > 1 ? "s" : ""))} {/*<span>(5)</span>*/}</div>}
                                                        id={ "ratings." + item }
                                                    /> }
                                                </React.Fragment>
                                            )) }
                                        </div>
                                    }
                                /> }
                                { store.filters.mealPlans.length && <Expandable
                                    open
                                    header={t("Board Basis")}
                                    content={
                                        <div class="expanded">
                                            { store.filters.mealPlans.indexOf("RO") > -1 && <FieldCheckbox formik={formik}
                                                label={t("Room Only")}
                                                id="mealPlans.RO"
                                            /> }
                                            { store.filters.mealPlans.indexOf("RB") > -1 && <FieldCheckbox formik={formik}
                                                label={t("Breakfast")}
                                                id="mealPlans.RB"
                                            /> }
                                        </div>
                                    }
                                /> }
{ /* todo:
    <div class="static item">{t("Map")}</div>
    <div class="expanded">
        <img src="/images/temporary/map.png" alt=""/>
    </div>
*/ }
{ /*
    <Expandable
        header={t("Property Type")}
        content={
            <div class="expanded">
            </div>
        }
    />
*/ }
{ /*
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
    <Expandable header={t("Accommodation Amenities")} />
    <Expandable header={t("Geo Location")} />
    <Expandable header={t("Leisure & Sport")} />
    <Expandable header={t("Business Features")} />
    <Expandable header={t("Accommodation Chain")} />
*/ }
                            </div>
                        </form>

                    );
            }} />

        );
    }
}

export default AccommodationFiltersPart;