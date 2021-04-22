import React from "react";
import Tiles from 'components/tiles';
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Loader } from "components/simple";
import Search from "parts/search-form/search-form";
import { $personal } from "stores";

const AccommodationTitlePage = observer(({ noSearch }) => {
    const { t } = useTranslation();

    if (!$personal.information?.email) // workaround for loader within registration process
        return <Loader white page />;

    return (
    <>
        { !noSearch &&
            <div className="search-fullsize-wrapper">
                <Search fullsize />
            </div>
        }
        <div className="tiles block">
            <section>
                <h2>{t("Countries & Hotels")}</h2>
                <Tiles list={[
                    {
                        city: 'PARIS, FRANCE',
                        flag: 'fr',
                        propertiesCount: '2831',
                        image: '/images/hotels/france.jpg'
                    },
                    {
                        city: 'LONDON, ENGLAND',
                        flag: 'gb',
                        propertiesCount: '3399',
                        image: '/images/hotels/london.jpg'
                    }
                ]} />
                <Tiles list={[
                    {
                        city: 'ROME, ITALY',
                        flag: 'it',
                        propertiesCount: '5965',
                        image: '/images/hotels/rome.jpg'
                    },
                    {
                        city: 'BARCELONA, SPAIN',
                        flag: 'es',
                        propertiesCount: '1770',
                        image: '/images/hotels/barcelona.jpg'
                    },
                    {
                        city: 'DUBAI, United Arab Emirates',
                        flag: 'ae',
                        propertiesCount: '949',
                        image: '/images/hotels/dubai.jpg'
                    }
                ]} />
                <h2>{t("Exclusive offers")}</h2>
                <Tiles list={[
                    {
                        title: 'EMERALD PALACE KEMPINSKI DUBAI, DUBAI',
                        flag: 'ae',
                        image: '/images/hotels/emeraldplace.jpg'
                    },
                    {
                        title: 'HILTON BAKU, BAKU',
                        flag: 'az',
                        image: '/images/hotels/hilton.jpg'
                    },
                    {
                        title: 'KEMPINSKI HOTEL MALL OF THE EMIRATES, DUBAI',
                        flag: 'ae',
                        image: '/images/hotels/kempinski.jpg'
                    },
                    {
                        title: 'PULLMAN DUBAI CREEK CITY CENTRE HOTEL, DUBAI',
                        flag: 'ae',
                        image: '/images/hotels/pullman.jpg'
                    }
                ]} />
            </section>
        </div>
    </>
    );
});

export default AccommodationTitlePage;
