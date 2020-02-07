import React from "react";
import {observer} from "mobx-react";
import { useTranslation } from "react-i18next";
import {Formik} from "formik";

import { FieldText } from "components/form";

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

            </section>
        </div>)
    }
}

export default UsersManagement;