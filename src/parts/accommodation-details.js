import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Stars } from "simple";
import Gallery from "components/gallery";

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
              hotel = this.props.accommodation;

        const Text = () => {
            var description = hotel.textualDescriptions?.[0]?.description || hotel.textualDescriptions?.[1]?.description;
            if (!description)
                return null;

            description = decodeHtml(description);

            if (this.state.fullDescription)
                return <div class="text" dangerouslySetInnerHTML={{__html: description}} />;

            return <div class="text">
                <div class="cut">
                    <div dangerouslySetInnerHTML={{__html: description}} />
                </div>
                <span class="expand"
                      onClick={() => this.setState({ fullDescription: true })}>
                    {t("more...")}
                </span>
            </div>;
        };

        return (
            <div class="details">
                <div class="top">
                    <div class="info">
                        <div class="name">
                            {hotel.name} <Stars count={hotel.rating} />
                        </div>
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

                <h2>{t("Accommodation Photos")}</h2>

                { !!hotel.pictures?.length && <Gallery pictures={hotel.pictures} /> }

                <Text />

                { this.state.fullDescription && <Amenities t={t} hotel={hotel} /> }
            </div>
        );
    }
}

export default AccommodationCommonDetailsPart;
