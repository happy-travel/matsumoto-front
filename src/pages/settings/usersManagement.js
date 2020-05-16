import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Link } from 'react-router-dom';

import { dateFormat, API } from "core";
import {PERMISSIONS} from "core/enums";
import { FieldText, FieldSwitch } from "components/form";
import Table from "components/table";
import UsersPagesHeader from "components/usersPagesHeader";
import {Loader} from "components/simple";

import UsersStore from "stores/usersStore";
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
        Cell: (item) => dateFormat.b(item.cell.value)
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
            const {inCounterpartyPermissions, id, agencyId} = AuthStore.activeCounterparty;
            if (inCounterpartyPermissions?.length > 0) {
                const url = `/settings/users/${item.cell.value}/${id}/${agencyId}`;
                return <Link to={url}><span className={`icon icon-action-pen-orange`}/></Link>
            }
            return '';
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
            const {id, agencyId, inCounterpartyPermissions} = AuthStore.activeCounterparty;
            if (inCounterpartyPermissions?.length > 0) {
                const url = inCounterpartyPermissions?.includes(PERMISSIONS.PERMISSION_MANAGEMENT_IN_AGENCY) ?
                    API.COUNTERPARTY_AGENCY_AGENTS(id, agencyId) :
                    API.COUNTERPARTY_AGENTS(id);
                API.get({
                    url,
                    success: (result) =>
                        UsersStore.setCounterpartyUsers(result)
                });
            }
        }
    }

    changeSearchField(values) {
        UsersStore.filterCounterpartyUsers(values?.searchField?.replace(/\n/g, ''));
    }

    render() {
        const { t } = useTranslation();
        const {usersCounterparty, usersCounterpartyIsLoading, usersTablePageInfo, usersCounterpartyCount} = UsersStore;

        return (<div>
            <UsersPagesHeader />
            <div className="users-management__search-wrapper">
               <section>
                   <Formik
                       onSubmit={this.changeSearchField}
                       render={formik => (
                           <form onSubmit={formik.handleSubmit}>
                               <div className="form">
                                   <div className="row">
                                       <FieldText formik={formik}
                                                  id="searchField"
                                                  label={t("Username, Name or E-mail")}
                                                  placeholder={t("Choose your Username, Name or E-mail")}
                                                  clearable
                                       />
                                       <div className="field field-no-grow">
                                           <div className="label"/>
                                           <div className="inner">
                                               <button type="submit" className="button users-management__button-search-user">
                                                   {t("Search user")}
                                               </button>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </form>
                       )}
                   />
               </section>
            </div>
            {usersCounterpartyIsLoading && <Loader />}
            {!usersCounterpartyIsLoading && <section>
                <div className="users-management__table__title">
                    <h2 className="users-pages__title" style={{ margin: 0 }}>{t("All Users")}</h2>
                    {/*<Link to="/settings/users/add" className="button users-management__button-add-new-user">*/}
                    {/*    {t("add new user")}*/}
                    {/*</Link>*/}
                </div>
                <Table
                  data={usersCounterparty}
                  count={usersCounterpartyCount}
                  fetchData={this.getUsersCounterparty}
                  columns={columns}
                  {...usersTablePageInfo}
                  className="users-management__table"
                  manualPagination
                />
            </section>}
        </div>)
    }
}

export default UsersManagement;
