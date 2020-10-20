import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { API } from "core";
import Table from "components/table";
import { Columns, Sorters, Searches } from "./table-data";
import store from "stores/accommodation-store";
import authStore from "stores/auth-store";

//todo : remove code duplicates
@observer
class AgencyBookingsManagementPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToBookingConfirmationId: null,
            filter_tab: null,
            agentIdFilter: null
        };
        this.setAgentIdFilter = this.setAgentIdFilter.bind(this);
    }

    componentDidMount() {
        store.setUserBookingList(null);
        API.get({
            url: API.AGENCY_BOOKINGS_LIST,
            after: list => {
                if (list?.length)
                    store.setUserBookingList(list.map(item => ({
                        ...item.data,
                        agent: item.agent
                    })));
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
            redirectToBookingConfirmationId,
            agentIdFilter
        } = this.state;

        if (redirectToBookingConfirmationId !== null)
            return <Redirect push to={"/accommodation/confirmation/" + redirectToBookingConfirmationId} />;

        var Tab = ({ text, value }) => (
            <li>
                <div
                    class={"item" + __class(value == filter_tab, "selected")}
                    onClick={() => this.setState({ filter_tab: value })}
                >
                    {text}
                </div>
            </li>
        );

        var filter = result => {
            if ("Cancelled" == filter_tab)
                return result.filter(item => "Cancelled" == item.status);

            result = result.filter(item => "Cancelled" != item.status);

            if ("Future" == filter_tab || "Complete" == filter_tab)
                return result.filter(item => {
                    var isFuture = moment(item.checkInDate).isAfter(new Date());
                    return ("Future" == filter_tab) ? isFuture: !isFuture;
                });

            if (agentIdFilter)
                return result.filter(item => item.agent.id == agentIdFilter);

            return result;
        };

        return (
            <div class="management block">
                <section>
                    <h2>
                        {t("Agency Bookings")}
                    </h2>
                </section>
                <div class="head-nav">
                    <section>
                        <nav>
                            <Tab text={t("All")} value={null} />
                            <Tab text={t("Future")} value="Future" />
                            <Tab text={t("Complete")} value="Complete" />
                            <Tab text={t("Cancelled")} value="Cancelled" />
                        </nav>
                    </section>
                </div>
                <section class="content agency">
                    <Table
                        columns={Columns(t, this.setAgentIdFilter)}
                        list={store.userBookingList}
                        textEmptyResult={t("No reservations found")}
                        textEmptyList={t("You don`t have any reservations")}
                        onRowClick={item => this.setState({ redirectToBookingConfirmationId: item.id })}
                        rowClassName={item => __class(getClassByStatus(item.status) == "gray", "gray")}
                        filter={filter}
                        sorters={Sorters(t)}
                        searches={Searches}
                        CustomFilter={
                            <div class="user-filter">
                                {agentIdFilter ?
                                    <div class="button-clear" onClick={
                                        () => this.setAgentIdFilter(null)
                                    }>{t("Show all agents bookings")}</div> :
                                    <div class="blue" onClick={
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
