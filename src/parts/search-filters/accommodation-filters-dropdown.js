import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { CachedForm, FieldCheckbox, FieldRange } from "components/form";
import { HotelStars } from "components/accommodation";
import { searchLoadWithNewFilters } from "tasks/accommodation/search-loaders";
import { $accommodation, $view } from "stores";

const AccommodationFiltersDropdown = observer(({ close }) => {
    const { t } = useTranslation();
    const { search, hotelArray, filtersLine } = $accommodation;
    const { filters } = search;
    const selected = $accommodation.selected.filters;

    if (!filters || (!hotelArray?.length && !filtersLine))
        return null;

    return (<>
        <div className="hide">{filters?.__source}</div>

        <CachedForm
            onSubmit={searchLoadWithNewFilters}
            initialValues={selected || {}}
            render={formik => (
                <div className="filters dropdown">
                    <div className="close-button" onClick={close}>
                        <span className="icon icon-close" />
                    </div>

                    <div className="price-range">
                        <h3>{t("Price Range")}</h3>
                        <h4>{t("Drag the slider to choose minimum and maximum prices")}</h4>
                        <FieldRange
                            formik={formik}
                            min={filters.price.min}
                            max={filters.price.max}
                            currency={filters.price.currency}
                            id="price"
                            onChange={formik.handleSubmit}
                        />
                    </div>

                    { !!filters?.ratings?.length &&
                        <div>
                            { filters.ratings.map((item,i) => (
                                <div key={i}>
                                    <FieldCheckbox
                                        formik={formik}
                                        label={<HotelStars count={i+1} />}
                                        id={ "ratings." + item }
                                        onChange={formik.handleSubmit}
                                    />
                                </div>
                            )) }
                        </div>
                    }
                    { !!filters?.boardBasis?.length &&
                        <div>
                            <h3>{t("Board Basis")}</h3>
                            { filters.boardBasis.map(item => (
                                <div key={item}>
                                    <FieldCheckbox
                                        formik={formik}
                                        label={t(item)}
                                        id={ "boardBasis." + item }
                                        onChange={formik.handleSubmit}
                                    />
                                </div>
                            )) }
                        </div>
                    }
                    { ( (__localhost || __devEnv) &&
                        !!filters?.__source?.length) &&
                            <div>
                                <h3>Data Provider</h3>
                                { filters.__source.map((item, i) => (
                                    <div key={i}>
                                        <FieldCheckbox
                                            formik={formik}
                                            label={ item }
                                            id={ "source." + item }
                                            onChange={formik.handleSubmit}
                                            key={i}
                                        />
                                    </div>
                                )) }
                            </div>
                    }
            </div>
        )} />
    </>);
});

export default AccommodationFiltersDropdown;