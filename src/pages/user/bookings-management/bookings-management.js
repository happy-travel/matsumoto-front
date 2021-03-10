import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import Table from "components/table";
import { Columns, Sorters, Searches } from "./table-data";
import store from "stores/accommodation-store";
import authStore from "stores/auth-store";

@observer
class AgencyBookingsManagementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter_tab: null,
            agentIdFilter: null
        };
        this.setAgentIdFilter = this.setAgentIdFilter.bind(this);
    }

    componentDidMount() {
        store.setUserBookingList(null);

        const permittedAgency = authStore.permitted("AgencyBookingsManagement");
        if (permittedAgency)
            API.get({
                url: API.AGENCY_BOOKINGS_LIST,
                after: list => {
                    if (list?.length)
                        store.setUserBookingList(list.map(item => ({
                            ...item.data,
                            agent: item.agent
                        })));
                    else
                        store.setUserBookingList([]);
                }
            });
        else
            API.get({
                url: API.BOOKING_LIST,
                success: list => {
                    store.setUserBookingList(list);
                }
            });
    }

    setAgentIdFilter(id) {
        this.setState({
            agentIdFilter: id
        });
    }

    render() {
        var { t } = useTranslation();
        var {
            filter_tab,
            agentIdFilter
        } = this.state;

        const permittedAgency = authStore.permitted("AgencyBookingsManagement");

        const Tab = ({ text, value }) => (
            <li>
                <div
                    className={"item" + __class(value == filter_tab, "active")}
                    onClick={() => this.setState({ filter_tab: value })}
                >
                    {text}
                </div>
            </li>
        );

        const filter = list => {
            var result;

            if ("Cancelled" == filter_tab)
                result = list.filter(item => "Cancelled" == item.status);
            else {
                result = list.filter(item => "Cancelled" != item.status);

                if ("Future" == filter_tab || "Complete" == filter_tab)
                    result = result.filter(item => {
                        var isFuture = moment(item.checkInDate).isAfter(new Date());
                        return ("Future" == filter_tab) ? isFuture : !isFuture;
                    });
            }

            if (agentIdFilter)
                result = result.filter(item => item.agent.id == agentIdFilter);

            return result;
        };

        return (
            <div className="management block">
                <section>
                    <h2>
                        { permittedAgency ? t("Agency Bookings") : t("Bookings") }
                    </h2>
                </section>
                <div className="head-nav">
                    <section>
                        <nav>
                            <Tab text={t("All")} value={null} />
                            <Tab text={t("Future")} value="Future" />
                            <Tab text={t("Complete")} value="Complete" />
                            <Tab text={t("Cancelled")} value="Cancelled" />
                        </nav>
                    </section>
                </div>
                <section className="content agency">
                    <Table
                        columns={Columns(permittedAgency)(t, this.setAgentIdFilter)}
                        list={store.userBookingList}
                        textEmptyResult={t("No reservations found")}
                        textEmptyList={t("You don`t have any reservations")}
                        onRowClick={item => redirect(`/booking/${item.referenceCode}`)}
                        filter={filter}
                        sorters={Sorters(permittedAgency)(t)}
                        searches={Searches(permittedAgency)}
                        CustomFilter={
                            permittedAgency &&
                                <div className="user-filter">
                                    {agentIdFilter ?
                                        <div className="button-clear" onClick={
                                            () => this.setAgentIdFilter(null)
                                        }>{t("Show all agents bookings")}</div> :
                                        <div className="blue" onClick={
                                            () => this.setAgentIdFilter(authStore.user.id)
                                        }>{t("Show only my bookings")}</div>
                                    }
                                </div>
                        }
                    />
                </section>
            </div>
        );
    }
}

export default AgencyBookingsManagementPage;
