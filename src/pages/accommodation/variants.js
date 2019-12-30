import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";
import { groupAndCount } from "components/simple";

import { API, dateFormat, price, plural } from "core";
import store from 'stores/accommodation-store';
import UI, { MODALS } from "stores/ui-store";

import AccommodationFilters from "parts/accommodation-filters";
import {
    FieldText,
    FieldCheckbox
} from "components/form";
import Breadcrumbs from "components/breadcrumbs";
import { Stars, Loader } from "components/simple";

@observer
class AccommodationVariantsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToAgreementsPage: false,
            loading: false
        };
        this.showDetailsModal = this.showDetailsModal.bind(this);
    }

    showDetailsModal(id) {
        UI.setModal(MODALS.ACCOMMODATION_DETAILS);
        UI.setModalData(null);
        API.get({
            url: API.ACCOMMODATION_DETAILS(id),
            success: result => UI.setModalData(result)
        });
    }

    accommodationSelect(accommodation) {
        this.setState({
            loading: true
        });
        API.post({
            url: API.AVAIL_ACCOMM_DETAILS(accommodation.accommodationDetails.id),
            body: {
                availabilityId: store.search.result.availabilityId
            },
            success: result => {
                store.selectAccommodation(result);
                this.setState({
                    redirectToAgreementsPage: true
                });
            },
            after: () => {
                this.setState({
                    loading: false
                });
            }
        });
    }

    render() {
        const { t } = useTranslation();

        if (this.state.redirectToAgreementsPage)
            return <Redirect push to="/accommodation/agreements" />;

        return (

<React.Fragment>
    <div class="variants block">
        { store?.search?.loading ?
        <Loader /> :

        <section class="double-sections">
            <AccommodationFilters />
            <div class="right-section">
                <div class="head">
                    <div class="title">
                        <h3>
                            {t("Results for")}: <b>{ store.search.form?.["destination"] }</b> <span>({store.hotelArray.length})</span>
                        </h3>
                        <Breadcrumbs noBackButton items={[
                            {
                                text: t("Find Accommodation")
                            }, {
                                text: store.search.form?.["destination"] || ""
                            }
                        ]}/>
                    </div>
                    { /* todo:
                    <div class="sorter">
                        <button class="button-expand">
                            {t("Sort by")}
                        </button>
                    </div>
                    <div class="input-wrap">
                        <div class="form">
                            <FieldText
                                placeholder={t("Search by a hotel name...")}
                            />
                        </div>
                    </div>
                    */ }
                </div>

                { (!store.hotelArray.length || !store.isValidFilterQuery) &&
                    <div>
                        <div class="head">
                            <div class="title">
                                <h3>{t("Found nothing?")}</h3>
                                <br/>
                                {t("You could reach our Operations team directly, and we pick an accommodation for you.")}
                                <br/>
                                <br/>
                                <a href="mailto:info@happytravel.com">{t("Email")}: info@happytravel.com</a>
                            </div>
                        </div>
                    </div> }

                { this.state.loading && <Loader page /> }

                { store.hotelArray.map(item =>
                <div class="variant" key={item.accommodationDetails.id}>
                    <div class="summary">
                        <div class="photo">
                            <img src={item.accommodationDetails.picture.source} alt="" />
                        </div>
                        <div class="title" onClick={() => this.showDetailsModal(item.accommodationDetails.id)} >
                            <h2>
                                <u>{item.accommodationDetails.name}</u>
                                <Stars count={item.accommodationDetails.rating} />
                            </h2>
                            <div class="category">
                                {t("Accommodation in")} {item.accommodationDetails.location.country}, {item.accommodationDetails.location.locality}<br/>
                                {item.accommodationDetails.location.address}
                            </div>
                            <div class="features">
                                <span class="icon icon-info-big"/>
                                { /* todo: <span class="icon icon-map" /> */ }
                                { /* todo: <span class="button pink mini-label">{t("Preferred")}</span> */ }
                            </div>
                        </div>
                        <div class="prices">
                            <div class="from">{t("From")}</div>
                            <div class="value">{price(item.agreements[0].price.currencyCode, item.fromPrice)}</div>
                        </div>
                    </div>
                    <div class="description">
                        <span>{t("Located in")} {item.accommodationDetails.location.locality}, {item.accommodationDetails.location.country} {item.accommodationDetails.name}.{" "}
                            {item.accommodationDetails.generalTextualDescription && item.accommodationDetails.generalTextualDescription.descriptions && item.accommodationDetails.generalTextualDescription.descriptions.en}</span>
                        { /* <span class="expand">{t("more...")}</span> */ }
                    </div>
                    <div class="table">
                        <div class="title">
                            {t("Recommended variant for")}{" "}
                            {plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}
                        </div>
                        <div class="billet">
                            <div class="count">
                                {plural(t, store.search.result.numberOfNights, "Night")},
                                {" "}{plural(t, store.search.request.roomDetails.reduce((res,item) => (res+item.adultsNumber+item.childrenNumber), 0), "Adult")}
                            </div>
                            <div class="price">
                                {price(item.agreements[0].price)}
                            </div>
                            <button class="button small" onClick={() => this.accommodationSelect(item)}>
                                {t("Choose Room")}
                            </button>
                        </div>
                        { item.agreements.slice(0, 2).map(agreement => <div class="row">
                            <div class="icons">
                                <span class="icon icon-man" />
                                {(agreement.rooms.length == 1 && agreement.rooms[0].type == "Single") ? null : <span class="icon icon-man" />}
                            </div>
                            <div class="main">
                                <h3>
                                    {groupAndCount(agreement.rooms)}
                                </h3>
                                <div>
                                    { !moment().isBefore(agreement.deadlineDate) ?
                                    <div class={"info" + (moment().isAfter(agreement.deadlineDate) ? " warning" : "")}>
                                        {t("Within deadline")} – {dateFormat.a(agreement.deadlineDate)}
                                    </div> :
                                    <div class="info green">
                                        {t("FREE Cancellation - Without Prepayment")}
                                    </div>
                                    }
                                </div>
                                <div class="info green">
                                    {agreement.boardBasisCode}: {"RO" == agreement.boardBasisCode ? t("Room only") : (t("Breakfast Included") + " " + agreement.mealPlan) }
                                </div>
                                <div class="paragraph">
                                    {agreement.contractType}
                                </div>
                            </div>
                        </div>) }
                    </div>
                </div>) }
            </div>
        </section> }
    </div>
</React.Fragment>
);
    }
}

export default AccommodationVariantsPage;
