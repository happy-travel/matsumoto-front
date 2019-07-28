import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";

import { FieldText } from 'components/form';
import Breadcrumbs from 'components/breadcrumbs';
import ActionSteps from 'components/action-steps';
import { Dual } from 'components/simple';

@observer
class AccommodationBookingPage extends React.Component {

render() {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <div class="booking block">
                <section class="double-sections">
                    <div class="left-section filters">
                        <div class="static item">{t('Booking Summary')}</div>
                        <div class="expanded">
                            <img src="/images/temporary/booking-panel.png" class="round" alt="" />
                        </div>
                        <div class="static item no-border">Hampton by Hilton Moscow Strogino</div>
                        <div class="subtitle">
                            Hotels in Moscow, Russia
                        </div>

                        <div class="static item">{t('Your Reservation')}</div>
                        <Dual
                            a={t('Arrival Date')}
                            b={'Tue, 30 Apr 2019'}
                        />
                        <Dual
                            a={t('Departure Date')}
                            b={'Wed, 01 May 2019'}
                        />
                        <Dual
                            a={t('Number of Rooms')}
                            b={'1'}
                        />

                        <div class="static item">{t('Room Information')}</div>
                        <Dual
                            a={t('Room Type')}
                            b={'Executive Studio, Lounge Access, 1 King, Sofa bed'}
                        />
                        <Dual
                            a={t('Board Basis')}
                            b={'Room Only'}
                        />
                        <Dual
                            a={t('Occupancy')}
                            b={'2 Adults , 2 Children, Children Ages: 3, 14'}
                        />

                        <div class="static item">{t('Room & Total Cost')}</div>
                        <Dual
                            a={t('Room Cost')}
                            b={'USD 125.26'}
                        />
                        <Dual
                            a={t('Total Cost')}
                            b={'USD 125.26'}
                        />
                        <div class="total-cost">
                            <div>{t('Reservation Total Cost')}</div>
                            <div>USD 125.26</div>
                        </div>
                    </div>
                    <div class="right-section">
                        <Breadcrumbs items={[
                            {
                                text: "Search accommodation",
                                link: "/search"
                            }, {
                                text: "Guest Details"
                            }
                        ]}/>
                        <ActionSteps
                            items={["Search accommodation", "Guest Details", "Booking confirmation"]}
                            current={1}
                        />
                        <h2>
                            <span>Room 1:</span> Executive Studio, Lounge Access, 1 King, Sofa bed
                        </h2>

                        FORM
                        {t('Title')}
                        {t('First Name')}
                        {t('Last Name')}

                        {t('Agent Reference')}
                        {t('Extra Meal')}
                        {t('Special Request')}

                        {t('Your Requests')}
                        TEXTAREA


                        <div class="switch-control" />

                        form/checkboxes 6+5


                        Do You Wish to Add Additional Services?

                        I have read and accepted the booking terms & conditions

                        confirm booking BUTTON

                    </div>
                </section>
            </div>
        </React.Fragment>
    );
}
}

export default AccommodationBookingPage;
