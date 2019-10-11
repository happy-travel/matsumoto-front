import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { dateFormat, API } from "core";

import Breadcrumbs from "components/breadcrumbs";
import ActionSteps from "components/action-steps";
import { Dual, Loader } from "components/simple";
import { Link } from "react-router-dom";

import store from "stores/accommodation-store";

@observer
class AccommodationConfirmationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingId: null
        };
        this.getValues = this.getValues.bind(this);
    }

    getValues() {
        var result = store.booking.result || {};

        if (this.state.bookingId !== null) {
            var selected = null;

            store.userBookingList.forEach(item => {
                if (item.bookingId == this.state.bookingId)
                    selected = item;
            });

            if (selected) {
                result = selected.bookingDetails;
                result.loaded = true;
            }
        }

        return {
            referenceCode: result.referenceCode,
            status: result.status,
            checkInDate: result.checkInDate,
            checkOutDate: result.checkOutDate,
            deadline: result.deadline,
            roomType: result.roomDetails?.[0]?.roomDetails.type,
            currency: store.selected?.variant?.currencyCode || "", //todo: wait for real data
            price: result.roomDetails?.[0]?.price.price,
            passengers: result.roomDetails?.[0]?.roomDetails.passengers,
            loaded: result.loaded,
            error: result.error
        };
    }

    componentDidMount() {
        if (this.props?.match?.params?.id !== undefined) {
            this.setState({bookingId: this.props?.match?.params?.id});
            API.get({
                url: API.ACCOMMODATION_BOOKING,
                after: (data) => store.setUserBookingList(data)
            });
        }
    }

render() {
    const { t } = useTranslation(),
          booking = this.getValues();

    if (!booking.loaded || booking.error)
        return (
            <div class="confirmation block">
                <div class="hide">{""+store.booking.result?.referenceCode}</div>
                <section class="double-sections">
                    <div class="middle-section">
                        <Breadcrumbs items={[
                            {
                                text: t("Search accommodation"),
                                link: "/search"
                            }, {
                                text: t("Booking Confirmation")
                            }
                        ]}/>
                        <ActionSteps
                            items={[t("Search accommodation"), t("Guest Details"), t("Booking Confirmation")]}
                            current={2}
                        />
                        <h2>
                            {t("Booking Details")}
                        </h2>
                        { !booking.error ? <Loader /> :
                        <React.Fragment>
                            <div class="result-code error">
                                <div class="before">
                                    <span class="icon icon-close white" />
                                </div>
                                <div class="text">
                                    {t("An error occured")}: <strong>{booking.error}</strong>
                                </div>
                            </div>
                            <div class="actions">
                                <Link to="/">
                                    <button class="button">
                                        {t("Try again")}
                                    </button>
                                </Link>
                            </div>
                        </React.Fragment>
                        }
                    </div>
                </section>
            </div>
        );

    return (
        <div class="confirmation block">
            <div class="hide">{''+store.booking.result}</div>
            <section class="double-sections">
                <div class="middle-section">
                    <Breadcrumbs items={[
                        {
                            text: t("Search accommodation"),
                            link: "/search"
                        }, {
                            text: t("Booking Confirmation")
                        }
                    ]}/>
                    <ActionSteps
                        items={[t("Search accommodation"), t("Guest Details"), t("Booking Confirmation")]}
                        current={2}
                    />
                    <h2>
                        {t("Booking Details")}
                    </h2>

                    <div class="result-code">
                        <div class="before">
                            <span class="icon icon-white-check" />
                        </div>
                        <div class="dual">
                            <div class="first">
                                {t("Booking Reference number")}: <strong>{booking.referenceCode}</strong>
                            </div>
                            <div class="second">
                                {t("Status")}: <strong>{booking.status}</strong>
                            </div>
                        </div>
                    </div>

                    <Dual
                        a={<Dual addClass="line"
                                a={"Check In Date"}
                                b={dateFormat.a(booking.checkInDate)}
                            />}
                        b={<Dual addClass="line"
                                a={"Check Out Date"}
                                b={dateFormat.a(booking.checkOutDate)}
                            />}
                    />
                    <Dual addClass="line"
                        a={"Within deadline"}
                        b={dateFormat.a(booking.deadline)}
                    />
                    <Dual addClass="line"
                        a={"Room type"}
                        b={booking.roomType}
                    />
                    <Dual addClass="line"
                        a={t('Total Cost')}
                        b={`${booking.currency} ${booking.price}`}
                    />

                    <h2>
                        {t("Leading Passenger")}
                    </h2>
                    <Dual
                        a={<Dual addClass="line"
                                a={"First name"}
                                b={booking.passengers?.[0]?.firstName}
                            />}
                        b={<Dual addClass="line"
                                a={"Last name"}
                                b={booking.passengers?.[0]?.lastName}
                            />}
                    />

                    { booking.passengers?.length > 1 && <React.Fragment>
                        <h2>
                            {t("Other Passengers")}
                        </h2>
                        {booking.passengers.map((item,index) => (
                            <React.Fragment>
                                {index ? <Dual
                                    a={<Dual addClass="line"
                                            a={"First name"}
                                            b={item.firstName}
                                        />}
                                    b={<Dual addClass="line"
                                            a={"Last name"}
                                            b={item.lastName}
                                        />}
                                /> : null}
                            </React.Fragment>
                        ))}
                    </React.Fragment> }

                    <div class="actions">
                    { this.state.bookingId === null ?
                        <Link to="/payment" class="left">
                            <button class="button">
                                {t("Pay now by Card")}
                            </button>
                        </Link>
                    :
                        <Link to="/user/booking" class="left">
                            <button class="button">
                                {t("Booking management")}
                            </button>
                        </Link>
                    }
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-time-left" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-pen" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-cancel" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-print" />
                        </a>
                        <a href="javascript:void(0)">
                            <span class="icon icon-action-writing" />
                        </a>
                        <Link to="/">
                            <button class="button green">
                                {t("Accept & reconfirm")}
                            </button>
                        </Link>
                    </div>

                </div>
            </section>
        </div>
    );
}
}

export default AccommodationConfirmationPage;
