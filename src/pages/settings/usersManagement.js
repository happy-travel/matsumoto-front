import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Link } from 'react-router-dom';

import { dateFormat, API } from "core";
import { FieldText, FieldSwitch } from "components/form";
import Table from "components/table";
import UsersPagesHeader from "components/usersPagesHeader";

import UsersStore from "stores/usersStore";
import AuthStore from "stores/auth-store";

const columns = [
    {
        Header: 'Name',
        accessor: 'FirstName',
    },
    {
        Header: 'Company Name',
        accessor: 'CompanyName',
    },
    {
        Header: 'SignUp Date',
        accessor: 'Created',
        Cell: (item) => dateFormat.b(item.cell.value)
    },
    {
        Header: 'Markup',
        accessor: 'markup',
    },
    {
        Header: 'Actions',
        accessor: '',
        Cell: () => <button disabled><span className={`icon icon-action-pen-orange`}/></button>
    },
];

@observer
class UsersManagement extends React.Component {
    constructor() {
        super();

        console.log(AuthStore.user);

        if (AuthStore.user?.companies[0]) {
            const {id, branchId} = AuthStore.user?.companies[0];
            API.get({
                url: API.COMPANY_BRANCH_CUSTOMERS(id, branchId),
                success: (result) =>
                    UsersStore.setCompanyUsers(result)
            });
        }
    }

    componentDidMount() {
        UsersStore.getUsersCompany();
    }

    render() {
        const { t } = useTranslation();
        const {usersCompany, getUsersCompany, usersCompanyIsLoading, usersTablePageInfo, usersCompanyCount} = UsersStore;

        return (<div>
            <UsersPagesHeader />
            <div className="users-management__search-wrapper">
               <section>
                   <Formik
                       render={formik => (
                           <form onSubmit={formik.handleSubmit}>
                               <div className="form">
                                   <div className="row">
                                       <FieldText formik={formik}
                                                  id="searchField"
                                                  label={t("Username, Name or E-mail")}
                                                  placeholder={t("Choose your Username, Name or E-mail")}
                                                  Flag={false}
                                           // Dropdown={DestinationDropdown}
                                           // options={UI.destinations}
                                           // setValue={this.setDestinationValue}
                                           // onChange={this.destinationInputChanged}
                                           // setAutoComplete={this.setDestinationAutoComplete}
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
                    <Link to="/settings/users/add" className="button users-management__button-add-new-user">
                        {t("add new user")}
                    </Link>
                </div>
                <Table
                    data={usersCompany}
                    count={usersCompanyCount}
                    fetchData={getUsersCompany}
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
