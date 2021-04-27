import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import { getLocale } from "core"
import { initApplication } from "core/init";
import App from "core/app";
import settings from "settings";
import tracker from "core/misc/tracker";

if (settings.sentry_dsn)
    Sentry.init({
        dsn: settings.sentry_dsn,
        environment: settings.sentry_environment
    });

tracker();

window.setPageDirectionFromLS = () => {
    const dir = ("ar" == getLocale() ? "rtl" : "ltr");
    document.getElementsByTagName("html")[0].setAttribute("dir", dir);
};
window.setPageDirectionFromLS();

window._renderTheApp = () => ReactDOM.render(<App />, document.getElementById("app"));
window._renderTheApp();

initApplication();
