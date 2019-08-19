import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { App, init } from "core";
import settings from "settings";

Sentry.init({ dsn: settings.sentryDSN });

window.setPageDirectionFromLS = () => {
    var dir = window.localStorage.getItem('direction');
    if (dir == "ltr" || dir == "rtl")
        document.getElementsByTagName("html")[0].setAttribute("dir", dir);
};
window.setPageDirectionFromLS();

ReactDOM.render(<App />, document.getElementById('app'));

init();
