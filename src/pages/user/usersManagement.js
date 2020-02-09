import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";

import { FieldText } from "components/form";
import Table from "components/table";

import data from './mocks';

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
        accessor: 'actions',
    },
    {
        Header: 'Status',
        accessor: 'markup',
    },
];

@observer
class UsersManagement extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { t } = useTranslation();

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
                                           // Icon={<span class="icon icon-hotel" />}
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
                    <button type="submit" className="button">
                        {t("add new user")}
                    </button>
                </div>
                <Table data={data} columns={columns} className="users-management__table" />
            </section>
        </div>)
    }
}

export default UsersManagement;
