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

import AuthStore from "stores/auth-store";

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Sign Up Date',
        accessor: 'created',
        Cell: (item) => dateFormat.b(item.cell.value * 1000)
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
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allUsers: null,
            filteredUsers: null,
            usersTablePageInfo: {
                pageIndex: 0,
                pageSize: 10
            }
        };
        this.loadUsers = this.loadUsers.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    componentDidMount() {
        this.loadUsers();
    }
    
    applyFilter(values) {
        var value = values?.text?.trim().replace(/\n/g, ''),
            users = this.state.allUsers || [];
        this.setState({
            filteredUsers:
                (!value?.length)
                    ? users || []
                    : users.filter(user =>
                        user.name.toLowerCase().includes(value.toLowerCase()))
        });
    }

    loadUsers() {
        if (AuthStore.activeCounterparty) {
            const { agencyId } = AuthStore.activeCounterparty;
            API.get({
                url: API.AGENCY_AGENTS(agencyId),
                success: result => this.setState({
                    allUsers: result,
                    filteredUsers: result || []
                }),
                after: () => this.setState({
                    loading: false
                })
            });
            return;
        }
        this.setState({
            loading: false
        });
    }

    render() {
        const { t } = useTranslation();

        return (
        <div class="settings wide block">
            <SettingsHeader />
            { /* <div class="search-wrapper">
               <section>
                   <Formik
                       initialValues={{}}
                       onSubmit={this.applyFilter}
                   >
                       {formik => (
                           <form onSubmit={formik.handleSubmit}>
                               <div class="form">
                                   <div class="row">
                                       <FieldText formik={formik}
                                                  id="text"
                                                  label={t("Name or E-mail")}
                                                  placeholder={t("Search...")}
                                                  clearable
                                       />
                                       <div class="field">
                                           <div class="label"/>
                                           <div class="inner">
                                               <button type="submit" class="button">
                                                   {t("Find user")}
                                               </button>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </form>
                       )}
                   </Formik>
               </section>
            </div> */ }
            {this.state.loading ?
                <Loader /> :
                <section>
                    <div>
                        <h2><span class="brand">{t("All Users")}</span></h2>
                    </div>
                    { this.state.allUsers === null && <h3>
                        {t("Nothing to show")}
                    </h3> }
                    { this.state.filteredUsers?.length === 0 && <h3>
                        {t("List is empty")}
                    </h3> }
                    { !!this.state.filteredUsers.length && <Table
                        data={this.state.filteredUsers}
                        count={this.state.filteredUsers.length}
                        fetchData={this.loadUsers}
                        columns={columns}
                        {...this.state.usersTablePageInfo}
                        manualPagination
                    /> }
                </section>
            }
        </div>
        );
    }
}

export default UsersManagement;
