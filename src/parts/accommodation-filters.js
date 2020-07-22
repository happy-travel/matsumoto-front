import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import {
    CachedForm,
    FORM_NAMES,
    FieldCheckbox,
    FieldRange
} from "components/form";
import { Expandable, Stars } from "simple";
import { loadCurrentSearchWithNewFilters } from "parts/search/search-logic";

import store from "stores/accommodation-store";

@observer
class AccommodationFiltersPart extends React.Component {
    submit(values) {
        loadCurrentSearchWithNewFilters(values);
    }

    render() {
        const { t } = useTranslation();
        return (
            <CachedForm
                id={ FORM_NAMES.AccommodationFiltersForm }
                onSubmit={this.submit}
                render={(formik, reset) => {
                    if (!store.filters || (!store.hotelArray?.length && !store.filtersLine && !store.search.loading))
                        return <div class="left-section filters" />;
                    return (
                        <div class="left-section filters">
                            <Expandable
                                open
                                header={t("Price Range")}
                                content={
                                    <div class="expanded price-range">
                                        <h4>{t("Drag the slider to choose minimum and maximum prices")}</h4>
                                        <FieldRange formik={formik}
                                            min={store.filters.price.min}
                                            max={store.filters.price.max}
                                            currency={store.filters.price.currency}
                                            id="price"
                                            onChange={formik.handleSubmit}
                                        />
                                    </div>
                                }
                            />
                            { !!store.filters?.ratings?.length && <Expandable
                                open
                                header={t("Rating")}
                                content={
                                    <div class="expanded">
                                        { store.filters.ratings.map((item,i) => (
                                            <FieldCheckbox formik={formik}
                                                label={<Stars count={i+1} />}
                                                id={ "ratings." + item }
                                                onChange={formik.handleSubmit}
                                            />
                                        )) }
                                    </div>
                                }
                            /> }
                            { !!store.filters?.boardBasis?.length && <Expandable
                                open
                                header={t("Board Basis")}
                                content={
                                    <div class="expanded">
                                        { store.filters.boardBasis.map(item => (
                                            <FieldCheckbox formik={formik}
                                                label={t(item)}
                                                id={ "boardBasis." + item }
                                                onChange={formik.handleSubmit}
                                            />
                                        )) }
                                    </div>
                                }
                            /> }
                            { ( (__localhost || __devEnv) &&
                                !!store.filters.__source.length) && <Expandable
                                open
                                header="Source"
                                content={
                                    <div class="expanded">
                                        { store.filters.__source.map((item, i) => (
                                            <FieldCheckbox formik={formik}
                                                           label={ "source=" + item }
                                                           id={ "source." + item }
                                                           onChange={formik.handleSubmit}
                                            />
                                        )) }
                                    </div>
                                }
                            /> }
                    </div>
                );
            }} />

        );
    }
}

export default AccommodationFiltersPart;