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
        accessor: 'customerId',
        Cell: (item) => {
            const {inCompanyPermissions, id, branchId} = AuthStore.currentCompany; // todo: change to current company
            if (inCompanyPermissions?.length > 0) {
                const url = `/settings/users/${item.cell.value}/${id}/${branchId}`;
                return <Link to={url}><span className={`icon icon-action-pen-orange`}/></Link>
            }
            return '';
        }
    },
];

@observer
class UsersManagement extends React.Component {
    getUsersCompany() {
        if (AuthStore.currentCompany) {
            const {id, branchId, inCompanyPermissions} = AuthStore.currentCompany;
            if (inCompanyPermissions?.length > 0) {
                const url = inCompanyPermissions?.includes(PERMISSIONS.PERMISSION_MANAGEMENT_IN_BRANCH) ?
                    API.COMPANY_BRANCH_CUSTOMERS(id, branchId) :
                    API.COMPANY_CUSTOMERS(id);
                API.get({
                    url,
                    success: (result) =>
                        UsersStore.setCompanyUsers(result)
                });
            }
        }
    }

    changeSearchField(values) {
        UsersStore.filterCompanyUsers(values.searchField);
    }

    render() {
        const { t } = useTranslation();
        const {usersCompany, usersCompanyIsLoading, usersTablePageInfo, usersCompanyCount} = UsersStore;

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
            <section>
                <div className="users-management__table__title">
                    <h3>All Users</h3>
                    {/*<Link to="/settings/users/add" className="button users-management__button-add-new-user">*/}
                    {/*    {t("add new user")}*/}
                    {/*</Link>*/}
                </div>
                <Table
                    data={usersCompany}
                    count={usersCompanyCount}
                    fetchData={this.getUsersCompany}
                    loading={usersCompanyIsLoading}
                    columns={columns}
                    {...usersTablePageInfo}
                    className="users-management__table"
                    manualPagination
                />
            </section>
        </div>)
    }
}

export default UsersManagement;
