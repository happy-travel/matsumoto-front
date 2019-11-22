import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import UI from "stores/ui-store";
import { Stars } from "components/simple";
import ImageGallery from 'react-image-gallery';

@observer
class AccommodationDetailsModal extends React.Component {
    render() {
        var { t } = useTranslation(),
            hotel = UI.modalData,
            { closeModal } = this.props;

        if (!hotel || !hotel.id)
            return null;

        return (
            <div class="details modal">
                {closeModal && <div class="close-button" onClick={closeModal}>
                    <span class="icon icon-close" />
                </div>}
                <div class="title">
                    <h2>
                        {t("Accommodation Details")}
                    </h2>
                </div>
                <div class="content">
                    <div class="top">
                        {hotel?.pictures?.[0]?.source && <div class="photo">
                            <img src={hotel.pictures[0].source} alt={hotel.pictures[0].caption} class="round" />
                        </div>}
                        <div class="info">
                            <div class="name">
                                {hotel.name}
                            </div>
                            <div>
                                <Stars count={hotel.rating} />
                            </div>
                            <div class="line">
                                <span class="icon icon-small-pin" />
                                {hotel.location.address} {hotel.location.city} {hotel.location.country}
                            </div>
                            <div class="line">
                                <span class="icon icon-small-phone" />
                                {hotel.contacts.telephone}
                            </div>
                        </div>
                    </div>

                    <div class="text">
                        {hotel.textualDescriptions?.[0]?.descriptions?.en || hotel.textualDescriptions?.[1]?.descriptions?.en || ''}
                    </div>

                    <h2>{t("Accommodation Photos")}</h2>

                    { hotel.pictures?.length && <div class="gallery">
                        <ImageGallery
                            items={hotel.pictures.map(item => ({
                                original: item.source,
                                thumbnail: item.source,
                                originalAlt: item.caption
                            }))}
                            showThumbnails={true}
                            showIndex={true}
                            lazyLoad={false}
                            showPlayButton={false}
                        />
                    </div> }

                    <table><tbody>
                        <tr>
                            <td>
                                <h2>{t("Additional Information")}</h2>
                                <ul>
                                    <li>{t("Number of floors")}: 1</li>
                                    <li>{t("Number of rooms: 1")}</li>
                                </ul>
                            </td>
                            <td>
                                <h2>{t("Accommodation Amenities")}</h2>
                                <ul>
                                    <li>{t("Bar")}</li>
                                    <li>{t("Laundry Service")}</li>
                                    <li>{t("Car Parking - Onsite Free")}</li>
                                    <li>{t("Elevators")}</li>
                                    <li>{t("Multilingual Staff")}</li>
                                    <li>{t("Safety Deposit Box")}</li>
                                </ul>
                            </td>
                            <td>
                                <h2>{t("Accommodation Amenities")}</h2>
                                <ul>
                                    <li>{t("Leisure & Sport Amenities")}</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>{t("Business Features & Amenities")}</h2>
                                <ul>
                                    <li>{t("Conference Rooms")}</li>
                                    <li>{t("Meeting Rooms")}</li>
                                </ul>
                            </td>
                            <td>
                                <h2>{t("Transportation & Directions To The Hotel")}</h2>
                                <div>{t("No Information")}</div>
                            </td>
                            <td />
                        </tr>
                    </tbody></table>

                    { /*
                    <div class="button-holder">
                        <button class="button">
                            <div class="image">
                                {t("Create PDF")}
                            </div>
                        </button>
                    </div>
                    */ }
                </div>
            </div>
        );
    }
}

export default AccommodationDetailsModal;
