import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Stars } from "components/simple";
import Gallery from "components/gallery";
import {ADDITIONAL_INFO} from "core/enums";

const Amenities = ({ hotel, t }) => {
    if (!hotel.accommodationAmenities?.length)
        return null;

    var list = hotel.accommodationAmenities;

    return <React.Fragment>
        <h2>{t("Accommodation Amenities")}</h2>
        <ul class="amenities">
            {list.map(item => (
                (item == item.toLowerCase()) ? <li>{t("amenities_" + item)}{" "}</li> : <li>{item}</li>
            ))}
        </ul>
    </React.Fragment>;
};

const descriptionLength = 450,
    decodeHtml = html => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value.trim();
    };

@observer
class AccommodationCommonDetailsPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullDescription: false
        }
    }

    render() {
        const { t } = useTranslation(),
              hotel = this.props.accommodation,
              { fromModal, fromPage } = this.props;

        const Text = () => {
            var description = hotel.textualDescriptions?.[0]?.description || hotel.textualDescriptions?.[1]?.description;
            if (!description)
                return null;

            description = decodeHtml(description);

            if (this.state.fullDescription)
                return <div class="text">{description}</div>;

            description = description.substr(0, descriptionLength);
            description = description.substr(0,
                Math.min(description.length, Math.max(description.lastIndexOf(" "), description.lastIndexOf("."))));

            return <div class="text">
                {description} <span class="expand"
                      onClick={() => this.setState({ fullDescription: true })}>
                    {t("more...")}
                </span>
            </div>;
        };

        return (
            <div class={"details" + (fromModal ? " from-modal" : "") + (fromPage ? " from-page" : "")}>
                <div class="top">
                    {fromModal && hotel?.pictures?.[0]?.source && <div class="photo">
                        <img src={hotel.pictures[0].source} alt={hotel.pictures[0].caption} class="round" />
                    </div>}
                    <div class="info">
                        <div class="name">
                            {hotel.name} { fromPage && <Stars count={hotel.rating} /> }
                        </div>
                        { fromModal && <div>
                            <Stars count={hotel.rating} />
                        </div> }
                        <div class="line">
                            <span class="icon icon-small-pin" />
                            <span class="subline">{hotel.location.address}, {hotel.location.locality}, {hotel.location.country}</span>
                        </div>
                        {hotel.contacts?.phone && <div class="line">
                            <span class="icon icon-small-phone" />
                            {hotel.contacts.phone}
                        </div>}
                    </div>
                </div>

                { fromModal && <Text /> }

                <h2>{t("Accommodation Photos")}</h2>

                { hotel.pictures?.length && <Gallery pictures={hotel.pictures} /> }

                { fromPage && <Text /> }

                { fromModal &&
                    <table><tbody>
                        <tr>
                            <td>
                                <h2>{t("Additional Information")}</h2>
                                <ul>
                                    {hotel?.additionalInfo && Object.keys(hotel?.additionalInfo).map((key) => {
                                        if (hotel.additionalInfo[key] != 0 && hotel.additionalInfo[key]) {
                                            return <li>{t(ADDITIONAL_INFO[key])}: {hotel.additionalInfo[key]}</li>
                                        }
                                        return null
                                    })}
                                </ul>
                            </td>
                            <Amenities t={t} hotel={hotel} />
                        </tr>
                        {/*<tr>*/}
                        {/*    <td>*/}
                        {/*        <h2>{t("Business Features & Amenities")}</h2>*/}
                        {/*        <ul>*/}
                        {/*            <li>{t("Conference Rooms")}</li>*/}
                        {/*            <li>{t("Meeting Rooms")}</li>*/}
                        {/*        </ul>*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        <h2>{t("Transportation & Directions To The Hotel")}</h2>*/}
                        {/*        <div>{t("No Information")}</div>*/}
                        {/*    </td>*/}
                        {/*    <td />*/}
                        {/*</tr>*/}
                    </tbody></table>
                }

                { this.state.fullDescription && <Amenities t={t} hotel={hotel} /> }
            </div>
        );
    }
}

export default AccommodationCommonDetailsPart;
