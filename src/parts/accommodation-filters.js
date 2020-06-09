import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import {
    CachedForm,
    FORM_NAMES,
    FieldCheckbox,
    FieldRange
} from "components/form";
import { Expandable, hotelStars } from "simple";

import store from "stores/accommodation-store";

@observer
class AccommodationFiltersPart extends React.Component {
    render() {
        const { t } = useTranslation();

        if (!store.filters)
            return <div class="left-section filters" />;

        return (
            <CachedForm
                id={ FORM_NAMES.AccommodationFiltersForm }
                render={formik => {
                    store.setSelectedFilters(formik.values);
                    return (
                            <div class="left-section filters">
                                { (store.filters.price.max - store.filters.price.min > 1) &&
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
                                { (store.filters.mealPlans.length > 1) && <Expandable
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
                                { ( (__localhost || __devEnv) &&
                                    (!!store.filters.__source.length)) && <Expandable
                                    open
                                    header="Source"
                                    content={
                                        <div class="expanded">
                                            { store.filters.__source.map((item, i) => (
                                                <FieldCheckbox formik={formik}
                                                               label={ "source=" + item }
                                                               id={ "source." + item }
                                                />
                                            )) }
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

                    );
            }} />

        );
    }
}

export default AccommodationFiltersPart;