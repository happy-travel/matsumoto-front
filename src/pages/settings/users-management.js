import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Link } from 'react-router-dom';
import { API } from "core";

import { dateFormat, Loader } from "simple";
import { FieldText } from "components/form";
import Table from "components/external/table";
import SettingsHeader from "./parts/settings-header";

import UsersStore from "stores/users-store";
import AuthStore from "stores/auth-store";

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Company Name',
        accessor: 'companyName',
    },
    {
        Header: 'SignUp Date',
        accessor: 'created',
        Cell: (item) => dateFormat.b(item.cell.value *1000)
    },
    {
        Header: 'Markup',
        accessor: 'markupSettings',
        Cell: (item) => item.cell.value || '-'
    },
    {
        Header: 'Actions',
        accessor: 'agentId',
        Cell: (item) => {
            const { id, agencyId } = AuthStore.activeCounterparty;
            return <Link
                to={`/settings/users/${item.cell.value}/${id}/${agencyId}`}
            ><span class={`icon icon-action-pen-orange`}/></Link>;
        }
    },
];

@observer
class UsersManagement extends React.Component {
    componentDidMount() {
        this.getUsersCounterparty();
    }

    getUsersCounterparty() {
        if (AuthStore.activeCounterparty) {
            const { agencyId } = AuthStore.activeCounterparty;
            API.get({
                url: API.AGENCY_AGENTS(agencyId),
                success: (result) =>
                    UsersStore.setCounterpartyUsers(result)
            });
        }
    }

    changeSearchField(values) {
        UsersStore.filterCounterpartyUsers(values?.searchField?.replace(/\n/g, ''));
    }

    render() {
        const { t } = useTranslation();
        const { usersCounterparty, usersCounterpartyIsLoading, usersTablePageInfo, usersCounterpartyCount } = UsersStore;

        return (
        <div class="settings wide block">
            <SettingsHeader />
            <div class="search-wrapper">
               <section>
                   <Formik
                       initialValues={{}}
                       onSubmit={this.changeSearchField}
                   >
                       {formik => (
                           <form onSubmit={formik.handleSubmit}>
                               <div class="form">
                                   <div class="row">
                                       <FieldText formik={formik}
                                                  id="searchField"
                                                  label={t("Username, Name or E-mail")}
                                                  placeholder={t("Choose your Username, Name or E-mail")}
                                                  clearable
                                       />
                                       <div class="field">
                                           <div class="label"/>
                                           <div class="inner">
                                               <button type="submit" class="button">
                                                   {t("Search user")}
                                               </button>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </form>
                       )}
                   </Formik>
               </section>
            </div>
            {usersCounterpartyIsLoading ?
                <Loader /> :
                <section>
                    <div>
                        <h2><span class="brand">{t("All Users")}</span></h2>
                    </div>
                    <Table
                        data={usersCounterparty}
                        count={usersCounterpartyCount}
                        fetchData={this.getUsersCounterparty}
                        columns={columns}
                        {...usersTablePageInfo}
                        manualPagination
                    />
                </section>
            }
        </div>
        );
    }
}

export default UsersManagement;
