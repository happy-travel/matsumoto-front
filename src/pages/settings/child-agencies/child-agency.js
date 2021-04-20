import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { date } from "simple";
import { Loader } from "components/simple";
import Breadcrumbs from "components/breadcrumbs";
import Markups from "parts/markups/markups";
import TransferBalance from "./parts/transfer-balance";
import { $personal } from "stores";

@observer
export default class ChildAgencyItemPage extends React.Component {
    state = {
        loading: true,
        agency: {}
    };
    
    componentDidMount() {
        this.loadAgency();
    }

    loadAgency = () => {
        const { id } = this.props.match.params;
        API.get({
            url: API.CHILD_AGENCY(id),
            success: agency => {
                this.setState({
                    agency,
                    loading: false
                });
            }
        })
    };

    activate = () => {
        const { id } = this.props.match.params;
        API.post({
            url: API.CHILD_AGENCY_ACTIVATE(id),
            success: () => this.setState({
                agency: {
                    ...this.state.agency,
                    isActive: true
                }
            })
        });
    };

    deactivate = () => {
        const { id } = this.props.match.params;
        API.post({
            url: API.CHILD_AGENCY_DEACTIVATE(id),
            success: () => this.setState({
                agency: {
                    ...this.state.agency,
                    isActive: false
                }
            })
        });
    };

    render() {
        const { t } = useTranslation(),
            { agency, loading } = this.state;

        return (
            <div className="settings block">
                <section>
                    <Breadcrumbs items={[
                        {
                            text: t("Agency"),
                            link: "/settings/counterparty"
                        },
                        {
                            text: t("Child Agencies"),
                            link: "/settings/child-agencies"
                        }, {
                            text: loading ? t("Agency") : agency.name
                        }
                    ]}/>

                    { loading ?
                        <Loader /> :
                        <>
                            <h2>{t("Information")}</h2>
                            <div className="row">
                                <b>{t("Agency")}</b>: {agency.name}
                            </div>
                            <div className="row">
                                <b>{t("Status")}</b>:{" "}
                                {agency.isActive ? "Active" : "Inactive"}
                            </div>
                            <div className="row">
                                <b>{t("Created")}</b>:{" "}
                                {date.format.c(agency.created)}
                            </div>

                            <div>
                                {!agency.isActive ?
                                    <button
                                        className="button"
                                        onClick={this.activate}
                                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                                    >
                                        {t("Activate agency")}
                                    </button> :
                                    <button
                                        className="button"
                                        onClick={this.deactivate}
                                        style={{ paddingLeft: "20px", paddingRight: "20px", marginRight: "20px" }}
                                    >
                                        {t("Deactivate agency")}
                                    </button>
                                }
                            </div>

                            { agency.isActive &&
                                <>
                                    <TransferBalance
                                        payerAccountId={$personal.activeCounterparty.agencyId}
                                        recipient={agency}
                                        onUpdate={this.loadAgency}
                                    />
                                    <Markups
                                        id={agency.id}
                                        emptyText={"Agency has no markups"}
                                        markupsRoute={API.CHILD_AGENCY_MARKUPS}
                                        markupRoute={API.CHILD_AGENCY_MARKUP}
                                    />
                                </>
                            }
                        </>
                    }
                </section>
            </div>
        );
    }
}
