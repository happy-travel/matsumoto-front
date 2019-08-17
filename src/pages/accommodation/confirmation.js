import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat } from "core";

import Breadcrumbs from 'components/breadcrumbs';
import ActionSteps from 'components/action-steps';
import { Dual } from 'components/simple';

import AccommodationStore from 'stores/accommodation-store';

@observer
class AccommodationConfirmationPage extends React.Component {

render() {
    const { t } = useTranslation();

    var result = AccommodationStore.bookingResult;

    return (
    <React.Fragment>
        <div class="confirmation block">
            <section class="double-sections">
                <div class="half-section" />
                <div class="right-section">
                    <Breadcrumbs items={[
                        {
                            text: "Search accommodation",
                            link: "/search"
                        }, {
                            text: "Booking Confirmation"
                        }
                    ]}/>
                    <ActionSteps
                        items={["Search accommodation", "Guest Details", "Booking confirmation"]}
                        current={2}
                    />
                    <h2>
                        {t('Booking Details')}
                    </h2>

                    <div class="result-code">
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t('Booking Reference number')}: <strong>{result.referenceCode}</strong>
                            </div>
                            <div class="second">
                                {t('Status')}: <strong>{result.status}</strong>
                            </div>
                        </div>
                    </div>

                    <Dual
                        a={<Dual addClass="line"
                                a={'checkInDate'}
                                b={dateFormat.a(result.checkInDate)}
                            />}
                        b={<Dual addClass="line"
                                a={'checkOutDate'}
                                b={dateFormat.a(result.checkOutDate)}
                            />}
                    />
                    <Dual addClass="line"
                        a={'tariffCode'}
                        b={result.tariffCode}
                    />

                    <h2>
                        {t('Leading Passenger')}
                    </h2>
                    <Dual
                        a={<Dual addClass="line"
                                a={'First name'}
                                b={window._pass_first_name}
                            />}
                        b={<Dual addClass="line"
                                a={'Last name'}
                                b={window._pass_last_name}
                            />}
                    />

                    <div class="actions">
                        <a href="#">
                            <span class="icon icon-action-time-left" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-pen" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-cancel" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-print" />
                        </a>
                        <a href="#">
                            <span class="icon icon-action-writing" />
                        </a>
                        <button class="button green">
                            {t('Accept & reconfirm')}
                        </button>
                    </div>

                </div>
                <div class="half-section" />
            </section>
        </div>
    </React.Fragment>
    );
}
}

export default AccommodationConfirmationPage;
