import React, {Component}  from 'react';
import { withTranslation } from 'react-i18next';
import {Link} from "react-router-dom";

class Home extends Component {

    render() {
        const { t, i18n } = this.props;

        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
        };

        return (
            <React.Fragment>
                <button onClick={() => changeLanguage('ar')}>ar</button>
                ---
                <button onClick={() => changeLanguage('en')}>en</button>
                <h2>{t('Accommodation')}</h2>
                <Link to="/accommodation/booking">
                    Booking
                </Link>
            </React.Fragment>
        );
    }
}

// extended main view with translate hoc
export default withTranslation()(Home);