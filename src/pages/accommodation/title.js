import React from 'react';
import Tiles from 'components/tiles';
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import authStore from "stores/auth-store";
import { Loader } from "../../components/simple";

@observer
class AccommodationTitlePage extends React.Component {
render () {
    var { t } = useTranslation();
    if (!authStore.cachedUserRegistered)
        return <Loader white page />;

    return (
    <React.Fragment>
        <div class="tiles block">
            <section>
                <h1><span>{t("Country & Hotels")}</span></h1>
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
                <h1><span>{t("Exclusive offers")}</span></h1>
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
    </React.Fragment>
);
}
}

export default AccommodationTitlePage;
