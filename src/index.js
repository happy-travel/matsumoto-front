import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { App, init } from "core";
import settings from "settings";

if (!("localhost" == window.location.hostname))
    Sentry.init({ dsn: settings.sentry_dsn });

window.setPageDirectionFromLS = () => {
    var dir = window.localStorage.getItem('direction');
    if (dir == "ltr" || dir == "rtl")
        document.getElementsByTagName("html")[0].setAttribute("dir", dir);
};
window.setPageDirectionFromLS();

export const RenderTheApp = () => ReactDOM.render(<App />, document.getElementById('app'));
RenderTheApp();

init();
