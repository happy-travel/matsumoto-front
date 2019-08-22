import React from 'react';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';

@observer
class AccommodationDetailsModal extends React.Component {
    render() {
        const { t, i18n } = useTranslation();

        return (
            <div class="modal">
                <div class="title">
                    Hotel Details
                    [x]
                </div>
                <div class="content">
                    Hampton by Hilton Moscow Strogino
                    3stars
                    20, Kulakova Street, Moscow, Russia 123592
                    +7 4997450600

                    Location: Located in Moscow (Strogino), Hampton by Hilton Moscow Strogino is convenient to Crocus Expo Center and All Weather Mountain Skiing Complex. This hotel is within the vicinity of Krylatskoye Ice Palace and Memorial Museum of German Anti Fascists. Rooms: 206 guestrooms featuring flat-screen televisions. Complimentary wireless Internet access keeps you connected, and satellite programming is available for your entertainment. Private bathrooms with showers feature complimentary toiletries and hair dryers. Conveniences include laptop-compatible safes and desks, and housekeeping is provided daily. Amenities: Featured amenities include a 24-hour business center, dry cleaning/laundry services, and a 24-hour front desk. This hotel also has 1608 square feet (149 square meters) of space consisting of conference space and meeting rooms. Free self-parking is available onsite.

                    Hotel Photos

                    GALLERY

                    <table><tbody>
                        <tr>
                            <td>
                                Additional Information
                                <ul>
                                    <li>Number of floors: 1</li>
                                    <li>Number of rooms: 1</li>
                                </ul>
                            </td>
                            <td>
                                Hotel Amenities
                                <ul>
                                    <li>Bar</li>
                                    <li>Laundry Service</li>
                                    <li>Car Parking - Onsite Free</li>
                                    <li>Elevators</li>
                                    <li>Multilingual Staff</li>
                                    <li>Safety Deposit Box</li>
                                </ul>
                            </td>
                            <td>
                                Hotel Amenities
                                <ul>
                                    <li>Leisure & Sport Amenities</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Business Features & Amenities
                                <ul>
                                    <li>Conference Rooms</li>
                                    <li>Meeting Rooms</li>
                                </ul>
                            </td>
                            <td>
                                Transportation & Directions To The Hotel
                                <div>No Information</div>
                            </td>
                            <td />
                        </tr>
                    </tbody></table>

                    <button class="button">
                        [img]
                        Create PDF
                    </button>
                </div>
            </div>
        );
    }
}

export default AccommodationDetailsModal;
