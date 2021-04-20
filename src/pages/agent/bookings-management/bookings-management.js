import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { API, redirect } from "core";
import { date } from "simple";
import Table from "components/table";
import { FieldCheckbox } from "components/form";
import { Columns, Sorters, Searches } from "./table-data";
import { $personal } from "stores";

const AgencyBookingsManagementPage = observer(() => {
    const [filterTab, setFilterTab] = useState(null);
    const [agentIdFilter, setAgentIdFilter] = useState(null);

    useEffect(() => {
        $personal.setBookingList(null);

        if (permittedAgency)
            API.get({
                url: API.AGENCY_BOOKINGS_LIST,
                after: list => {
                    if (list?.length)
                        $personal.setBookingList(list.map(item => ({
                            ...item.data,
                            agent: item.agent
                        })));
                    else
                        $personal.setBookingList([]);
                }
            });
        else
            API.get({
                url: API.BOOKING_LIST,
                success: list => {
                    $personal.setBookingList(list);
                }
            });
    }, []);
    
    const Tab = ({ text, value }) => (
        <li>
            <div
                className={"item" + __class(value == filterTab, "active")}
                onClick={() => setFilterTab(value)}
            >
                {text}
            </div>
        </li>
    );

    const filter = list => {
        let result;

        if ("Cancelled" == filterTab)
            result = list.filter(item => "Cancelled" == item.status);
        else {
            result = list.filter(item => "Cancelled" != item.status);

            if ("Future" == filterTab || "Complete" == filterTab)
                result = result.filter(item => {
                    var isFuture = !date.passed(item.checkInDate);
                    return ("Future" == filterTab) ? isFuture : !isFuture;
                });
        }

        if (agentIdFilter !== null)
            result = result.filter(item => item.agent.id == agentIdFilter);

        return result;
    };

    const permittedAgency = $personal.permitted("AgencyBookingsManagement");
    
    const { t } = useTranslation();

    return (
        <div className="management block">
            <section className="sticky-header">
                <h2>
                    { permittedAgency ? t("Agency Bookings") : t("Bookings") }
                </h2>
            </section>
            <div className="navigation">
                <section>
                    <nav>
                        <Tab text={t("All Bookings")} value={null} />
                        <Tab text={t("Future")} value="Future" />
                        <Tab text={t("Complete")} value="Complete" />
                        <Tab text={t("Cancelled")} value="Cancelled" />
                    </nav>
                </section>
            </div>
            <section className="content agency">
                <Table
                    columns={Columns(permittedAgency)(t, setAgentIdFilter)}
                    list={$personal.bookingList}
                    textEmptyResult={t("No reservations found")}
                    textEmptyList={t("You don`t have any reservations")}
                    onRowClick={item => redirect(`/booking/${item.referenceCode}`)}
                    filter={filter}
                    sorters={Sorters(permittedAgency)(t)}
                    searches={Searches(permittedAgency)}
                    CustomFilter={
                        permittedAgency &&
                            <div className="agent-filter">
                                <FieldCheckbox
                                    label={t("Show Only My Bookings")}
                                    onChange={(value) => setAgentIdFilter(value ? $personal.information.id : null)}
                                />
                            </div>
                    }
                />
            </section>
        </div>
    );
});

export default AgencyBookingsManagementPage;
