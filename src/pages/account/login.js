import React, { Component }  from 'react';
import { withTranslation } from 'react-i18next';
import { FieldText } from 'components/form';
import { Link } from "react-router-dom";

class Home extends Component {

    render() {
        const { t, i18n } = this.props;
        return (
            <div class="account block">
                <div class="picture">
                    <div class="supplier">
                        <span class="icon icon-supplier" />
                        Are you supplier?
                    </div>
                </div>
                <div class="menu">
                    <div class="place">
                        <div class="logo" />
                    </div>
                    <div class="form">
                        <div class="title">
                            <b>Log</b> In
                        </div>
                        <div class="form">
                            <div class="row">
                                <FieldText
                                    id={"field-login-username"}
                                    label={'Username or E-mail'}
                                    placeholder={'example@company.com'}
                                    clearable
                                />
                            </div>
                            <div class="row">
                                <FieldText
                                    id={"field-login-password"}
                                    label={'Password'}
                                    placeholder={'***************'}
                                    clearable
                                    addClass="size-large"
                                />
                            </div>
                            <div class="row">
                                <div class="field">
                                    <div class="label"/>
                                    <div class="inner">
                                        <Link to="/">
                                            <button
                                                onClick={ null }
                                                class="button">
                                                Log in
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="place">
                        Don`t have an account? <a href="#" class="link">Create new one</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Home);