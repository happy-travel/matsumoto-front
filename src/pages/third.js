import React, {Component}  from 'react';
import { withTranslation } from 'react-i18next';

class Home extends Component {

    render() {
        const { t, i18n } = this.props;

        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
        };

        return (
            <React.Fragment>
                <button onClick={() => changeLanguage('it')}>it</button>
                <button onClick={() => changeLanguage('en')}>en</button>
                <h2>{t('Home')}</h2>
                <b>indowx</b>
            </React.Fragment>
        );
    }
}

// extended main view with translate hoc
export default withTranslation()(Home);