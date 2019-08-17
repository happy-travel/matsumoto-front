import React from 'react';

import Tiles from 'components/tiles';

const AccommodationTitlePage = () => (
    <React.Fragment>
        <div class="tiles block">
            <section>
                <h1><span>Country & Hotels</span></h1>
                <Tiles list={[
                    {
                        city: 'PARIS, FRANCE',
                        flag: 'fr',
                        propertiesCount: '161',
                        minPrice: '29.98',
                        image: '/images/hotels/france.png'
                    },
                    {
                        city: 'LONDON, ENGLAND',
                        flag: 'gb',
                        propertiesCount: '334',
                        minPrice: '44.34',
                        image: '/images/hotels/london.png'
                    }
                ]} />
                <Tiles list={[
                    {
                        city: 'ROME, ITALY',
                        flag: 'it',
                        propertiesCount: '65',
                        minPrice: '34.11',
                        image: '/images/hotels/rome.png'
                    },
                    {
                        city: 'BARCELONA, SPAIN',
                        flag: 'es',
                        propertiesCount: '223',
                        minPrice: '32.32',
                        image: '/images/hotels/barcelona.png'
                    },
                    {
                        city: 'DORTMUND, GERMANY',
                        flag: 'fr',
                        propertiesCount: '11',
                        minPrice: '23.17',
                        image: '/images/hotels/dortmund.png'
                    }
                ]} />
                <h1><span>Exclusive offers</span></h1>
                <Tiles list={[
                    {
                        title: 'EMERALD PALACE KEMPINSKI DUBAI, DUBAI',
                        flag: 'ae',
                        exclusive: true,
                        image: '/images/hotels/emeraldplace.png'
                    },
                    {
                        title: 'HILTON BAKU, BAKU',
                        flag: 'az',
                        exclusive: true,
                        image: '/images/hotels/hilton.png'
                    },
                    {
                        title: 'KEMPINSKI HOTEL MALL OF THE EMIRATES, DUBAI',
                        flag: 'ae',
                        exclusive: true,
                        image: '/images/hotels/kempinski.png'
                    },
                    {
                        title: 'PULLMAN DUBAI CREEK CITY CENTRE HOTEL, DUBAI',
                        flag: 'ae',
                        exclusive: true,
                        image: '/images/hotels/pullman.png'
                    }
                ]} />
            </section>
        </div>
    </React.Fragment>
);

export default AccommodationTitlePage;
