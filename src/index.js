import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import init from "core/init";
import App from "core/app";
import settings from "settings";

if (!__localhost)
    Sentry.init({ dsn: settings.sentry_dsn });

window.setPageDirectionFromLS = () => {
    var dir = window.localStorage.getItem('direction');
    if (dir == "ltr" || dir == "rtl")
        document.getElementsByTagName("html")[0].setAttribute("dir", dir);
};
window.setPageDirectionFromLS();

window._renderTheApp = () => ReactDOM.render(<App />, document.getElementById('app'));
window._renderTheApp();

init();
