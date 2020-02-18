import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";

import { dateFormat } from "core";
import { FieldText, FieldSwitch } from "components/form";
import Table from "components/table";

import UsersStore from "stores/usersStore";

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Company Name',
        accessor: 'company',
    },
    {
        Header: 'Location',
        accessor: 'location',
    },
    {
        Header: 'SignUp Date',
        accessor: 'signUpDate',
        Cell: (item) => dateFormat.b(item.cell.value)
    },
    {
        Header: 'Markup',
        accessor: 'markup',
    },
    {
        Header: 'Type',
        accessor: 'type',
    },
    {
        Header: 'Actions',
        accessor: '',
        Cell: () => <button disabled><span className={`icon icon-action-pen-orange`}/></button>
    },
    {
        Header: 'Status',
        accessor: 'markup',
        Cell: (item) => <FieldSwitch />
    },
];

@observer
class UsersManagement extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        UsersStore.getUsersCompany();
    }

    render() {
        const { t } = useTranslation();
        const {usersCompany, getUsersCompany, usersCompanyIsLoading, usersTablePageInfo, usersCompanyCount} = UsersStore;

        return (<div>
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
                                       <div className="field">
                                           <div className="label"/>
                                           <div className="inner">
                                               <button type="submit" className="button">
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
                    <button type="submit" className="button users-management__button-search-user">
                        {t("add new user")}
                    </button>
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
