import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from 'core/app';
import init from 'core/init';

Sentry.init({dsn: "https://21e4194b435946e0b2e20444d6948d25@sentry.dev.happytravel.com/4"});

window.setPageDirectionFromLS = () => {
    var dir = window.localStorage.getItem('direction');
    if (dir == "ltr" || dir == "rtl")
        document.getElementsByTagName("html")[0].setAttribute("dir", dir);
};
window.setPageDirectionFromLS();

ReactDOM.render(<App />, document.getElementById('app'));

init();
